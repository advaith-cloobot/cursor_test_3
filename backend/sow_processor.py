from gpt_utils import process_gpt_response, GPT_4_32K, JSON_OBJ
from constants import SALESFORCE_SOW_SYSTEM_PROMPT
from models import WorkspaceSOWModel, WorkspaceModel

def process_workspace_files(workspace_id, file_contents):
    """Process uploaded files and generate SOW using GPT"""
    try:
        # Update workspace status to processing
        WorkspaceModel.update_processing_status(workspace_id, 'processing')
        print('file_contents::',file_contents)
        # Construct GPT conversation messages
        messages = [
            {"role": "system", "content": SALESFORCE_SOW_SYSTEM_PROMPT},
            {"role": "user", "content": file_contents}
        ]
        
        # Call GPT processing
        result, input_tokens, output_tokens, gpt_type = process_gpt_response(
            GPT_4_32K, messages, JSON_OBJ, max_tokens=10000
        )
        print('result::',result)
        if result and isinstance(result, dict):
            # Extract individual components from GPT response
            scope_summary = result.get('scope_summary', {})
            modules = result.get('modules', [])
            business_units = result.get('business_units', [])
            salesforce_licenses_extracted = result.get('salesforce_licenses', [])
            assumptions = result.get('assumptions', [])
            validation_summary = result.get('validation_summary', {})
            
            # Store SOW data in database
            WorkspaceSOWModel.create(
                workspace_id=workspace_id,
                scope_summary=scope_summary,
                modules=modules,
                business_units=business_units,
                salesforce_licenses_extracted=salesforce_licenses_extracted,
                assumptions=assumptions,
                validation_summary=validation_summary
            )
            
            # Update workspace status to completed
            WorkspaceModel.update_processing_status(workspace_id, 'completed')
            WorkspaceModel.set_has_files(workspace_id, True)
            
            return True, "SOW generated successfully"
        else:
            # Update workspace status to failed
            WorkspaceModel.update_processing_status(workspace_id, 'failed')
            return False, "Failed to generate valid SOW data from GPT response"
            
    except Exception as e:
        # Update workspace status to failed
        WorkspaceModel.update_processing_status(workspace_id, 'failed')
        return False, f"Error processing files: {str(e)}"

def get_sow_data(workspace_id):
    """Get SOW data for a workspace"""
    return WorkspaceSOWModel.get_by_workspace_id(workspace_id)
