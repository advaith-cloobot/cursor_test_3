from gpt_utils import process_gpt_response, GPT_4_32K, JSON_OBJ
from constants import MEETING_EXTRACTION_SYSTEM_PROMPT
from models import MeetingExtractedValueModel, MeetingModel

def extract_meeting_values(meeting_id, file_contents):
    """Process meeting files and extract V1-V16 values using GPT"""
    try:
        # Update meeting status to processing
        MeetingModel.update_processing_status(meeting_id, 'processing')
        
        # Construct GPT conversation messages
        messages = [
            {"role": "system", "content": MEETING_EXTRACTION_SYSTEM_PROMPT},
            {"role": "user", "content": file_contents}
        ]
        
        # Call GPT processing using existing GPT_4_32K
        result, input_tokens, output_tokens, gpt_type = process_gpt_response(
            GPT_4_32K, messages, JSON_OBJ, max_tokens=15000
        )
        
        print('Meeting extraction result::', result)
        
        if result and isinstance(result, dict):
            # Extract V1-V16 values from GPT response
            extracted_data = {}
            
            # Map GPT response keys to our value types
            value_mapping = {
                'V1_list_of_bu_teams': 'V1',
                'V2_modules_and_processes': 'V2', 
                'V3_license_list': 'V3',
                'V4_personas': 'V4',
                'V5_requirements': 'V5',
                'V6_risks_and_issues': 'V6',
                'V7_action_items': 'V7',
                'V8_decisions': 'V8',
                'V9_dependencies': 'V9',
                'V10_pain_points': 'V10',
                'V11_current_state_as_is': 'V11',
                'V12_target_state_to_be': 'V12',
                'V13_applications_to_be_integrated': 'V13',
                'V14_data_migration': 'V14',
                'V15_data_model': 'V15',
                'V16_metadata_to_update': 'V16'
            }
            
            # Extract each value type
            for gpt_key, value_type in value_mapping.items():
                extracted_data[value_type] = result.get(gpt_key, [])
            
            # Store extracted values in database
            MeetingExtractedValueModel.bulk_create(meeting_id, extracted_data)
            
            # Update meeting status to completed
            MeetingModel.update_processing_status(meeting_id, 'completed')
            MeetingModel.set_has_files(meeting_id, True)
            
            return True, "Meeting values extracted successfully"
        else:
            # Update meeting status to failed
            MeetingModel.update_processing_status(meeting_id, 'failed')
            return False, "Failed to generate valid meeting values from GPT response"
            
    except Exception as e:
        # Update meeting status to failed
        MeetingModel.update_processing_status(meeting_id, 'failed')
        return False, f"Error processing meeting files: {str(e)}"

def get_meeting_values(meeting_id):
    """Get all extracted values for a meeting"""
    return MeetingExtractedValueModel.get_by_meeting_id(meeting_id)
