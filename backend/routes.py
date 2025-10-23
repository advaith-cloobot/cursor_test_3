from flask import Blueprint, request, jsonify
from models import WorkspaceModel, WorkspaceFileModel, WorkspaceSOWModel
from file_processor import process_uploaded_files, combine_extracted_content
from sow_processor import process_workspace_files, get_sow_data
import os

routes = Blueprint('routes', __name__)

# Salesforce license options
SALESFORCE_LICENSES = [
    "Sales Cloud",
    "Service Cloud", 
    "Platform",
    "Field Service Lightning (FSL)",
    "Marketing Cloud",
    "Commerce Cloud",
    "Experience Cloud",
    "Analytics Cloud",
    "Nonprofit Cloud",
    "Education Cloud"
]

@routes.route('/api/workspaces', methods=['GET'])
def get_workspaces():
    """Get all workspaces"""
    try:
        workspaces = WorkspaceModel.get_all()
        return jsonify({'success': True, 'data': workspaces})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces', methods=['POST'])
def create_workspace():
    """Create a new workspace"""
    try:
        data = request.get_json()
        name = data.get('name')
        salesforce_licenses = data.get('salesforce_licenses', [])
        project_type = data.get('project_type')
        
        if not name or not project_type:
            return jsonify({'success': False, 'error': 'Name and project type are required'}), 400
        
        workspace_id = WorkspaceModel.create(name, salesforce_licenses, project_type)
        return jsonify({'success': True, 'data': {'id': workspace_id}})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>', methods=['GET'])
def get_workspace(workspace_id):
    """Get workspace by ID"""
    try:
        workspace = WorkspaceModel.get_by_id(workspace_id)
        if workspace:
            return jsonify({'success': True, 'data': workspace})
        else:
            return jsonify({'success': False, 'error': 'Workspace not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>', methods=['PUT'])
def update_workspace(workspace_id):
    """Update workspace"""
    try:
        data = request.get_json()
        name = data.get('name')
        salesforce_licenses = data.get('salesforce_licenses')
        project_type = data.get('project_type')
        
        success = WorkspaceModel.update(workspace_id, name, salesforce_licenses, project_type)
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Workspace not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>', methods=['DELETE'])
def delete_workspace(workspace_id):
    """Delete workspace"""
    try:
        success = WorkspaceModel.delete(workspace_id)
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Workspace not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>/upload', methods=['POST'])
def upload_files(workspace_id):
    """Upload files and process them"""
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        if not files or all(file.filename == '' for file in files):
            return jsonify({'success': False, 'error': 'No files selected'}), 400
        
        # Process uploaded files
        extracted_contents = process_uploaded_files(workspace_id, files)
        
        if not extracted_contents:
            return jsonify({'success': False, 'error': 'No valid files processed'}), 400
        
        # Store file records in database
        for content in extracted_contents:
            WorkspaceFileModel.create(
                workspace_id=workspace_id,
                filename=content['filename'],
                file_path=content['file_path'],
                file_type=content['file_type'],
                extracted_content=content['extracted_content']
            )
        
        # Combine all extracted content
        combined_content = combine_extracted_content(extracted_contents)
        
        # Process with GPT to generate SOW
        success, message = process_workspace_files(workspace_id, combined_content)
        
        if success:
            return jsonify({'success': True, 'message': message})
        else:
            return jsonify({'success': False, 'error': message}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>/sow', methods=['GET'])
def get_workspace_sow(workspace_id):
    """Get SOW data for workspace"""
    try:
        sow_data = get_sow_data(workspace_id)
        if sow_data:
            return jsonify({'success': True, 'data': sow_data})
        else:
            return jsonify({'success': False, 'error': 'SOW data not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/licenses', methods=['GET'])
def get_licenses():
    """Get predefined Salesforce license list"""
    try:
        return jsonify({'success': True, 'data': SALESFORCE_LICENSES})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
