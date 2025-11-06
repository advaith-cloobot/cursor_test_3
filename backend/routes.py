from flask import Blueprint, request, jsonify
from models import WorkspaceModel, WorkspaceFileModel, WorkspaceSOWModel, MeetingModel
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

# Meeting Management Routes
@routes.route('/api/workspaces/<int:workspace_id>/meetings', methods=['GET'])
def get_workspace_meetings(workspace_id):
    """Get all meetings for a workspace"""
    try:
        meetings = MeetingModel.get_all_by_workspace(workspace_id)
        return jsonify({'success': True, 'data': meetings})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>/meetings', methods=['POST'])
def create_meeting(workspace_id):
    """Create a new meeting"""
    try:
        data = request.get_json()
        meeting_name = data.get('meeting_name')
        stakeholders = data.get('stakeholders', [])
        meeting_date = data.get('meeting_date')
        meeting_details = data.get('meeting_details', '')
        
        if not meeting_name or not meeting_date:
            return jsonify({'success': False, 'error': 'Meeting name and date are required'}), 400
        
        meeting_id = MeetingModel.create(
            workspace_id=workspace_id,
            meeting_name=meeting_name,
            stakeholders=stakeholders,
            meeting_date=meeting_date,
            meeting_details=meeting_details
        )
        
        return jsonify({'success': True, 'data': {'id': meeting_id}})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/meetings/<int:meeting_id>', methods=['GET'])
def get_meeting(meeting_id):
    """Get meeting details"""
    try:
        meeting = MeetingModel.get_by_id(meeting_id)
        if not meeting:
            return jsonify({'success': False, 'error': 'Meeting not found'}), 404
        
        return jsonify({'success': True, 'data': meeting})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/meetings/<int:meeting_id>', methods=['PUT'])
def update_meeting(meeting_id):
    """Update meeting"""
    try:
        data = request.get_json()
        
        success = MeetingModel.update(
            meeting_id=meeting_id,
            meeting_name=data.get('meeting_name'),
            stakeholders=data.get('stakeholders'),
            meeting_date=data.get('meeting_date'),
            meeting_details=data.get('meeting_details')
        )
        
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to update meeting'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/meetings/<int:meeting_id>', methods=['DELETE'])
def delete_meeting(meeting_id):
    """Delete meeting"""
    try:
        success = MeetingModel.delete(meeting_id)
        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to delete meeting'}), 400
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/meetings/<int:meeting_id>/upload', methods=['POST'])
def upload_meeting_files(meeting_id):
    """Upload files for a meeting and trigger value extraction"""
    try:
        if 'files' not in request.files:
            return jsonify({'success': False, 'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'success': False, 'error': 'No files selected'}), 400
        
        # Get meeting details
        meeting = MeetingModel.get_by_id(meeting_id)
        if not meeting:
            return jsonify({'success': False, 'error': 'Meeting not found'}), 404
        
        # Process uploaded files
        from meeting_file_processor import process_meeting_files, combine_meeting_content
        from meeting_value_extractor import extract_meeting_values
        from models import MeetingFileModel
        
        extracted_contents = process_meeting_files(meeting['workspace_id'], meeting_id, files)
        
        if not extracted_contents:
            return jsonify({'success': False, 'error': 'No files were processed'}), 400
        
        # Save file records
        for content in extracted_contents:
            MeetingFileModel.create(
                meeting_id=meeting_id,
                filename=content['filename'],
                file_path=content['file_path'],
                file_type=content['file_type'],
                extracted_content=content['extracted_content']
            )
        
        # Combine all content and extract values
        combined_content = combine_meeting_content(extracted_contents)
        success, message = extract_meeting_values(meeting_id, combined_content)
        
        if success:
            return jsonify({'success': True, 'message': message})
        else:
            return jsonify({'success': False, 'error': message}), 500
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/meetings/<int:meeting_id>/values', methods=['GET'])
def get_meeting_values(meeting_id):
    """Get all extracted values for a meeting"""
    try:
        from meeting_value_extractor import get_meeting_values
        values = get_meeting_values(meeting_id)
        return jsonify({'success': True, 'data': values})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@routes.route('/api/workspaces/<int:workspace_id>/stakeholders', methods=['GET'])
def get_workspace_stakeholders(workspace_id):
    """Get stakeholders from workspace SOW for dropdown"""
    try:
        from models import WorkspaceSOWModel
        sow_data = WorkspaceSOWModel.get_by_workspace_id(workspace_id)
        
        stakeholders = []
        if sow_data and sow_data.get('business_units'):
            business_units = sow_data['business_units']
            for unit in business_units:
                if unit.get('stakeholders'):
                    for stakeholder in unit['stakeholders']:
                        stakeholders.append({
                            'id': f"{unit['business_unit_name']}_{stakeholder['name']}",
                            'name': stakeholder['name'],
                            'designation': stakeholder['designation'],
                            'email': stakeholder['email'],
                            'business_unit': unit['business_unit_name']
                        })
        
        return jsonify({'success': True, 'data': stakeholders})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
