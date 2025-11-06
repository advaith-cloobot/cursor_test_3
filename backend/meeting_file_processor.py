import os
from file_processor import extract_text_from_pdf, extract_text_from_doc
from database import get_meeting_upload_dir
from models import MeetingModel

def extract_meeting_content(file_path, file_type):
    """Extract text from meeting file based on type"""
    if file_type.lower() == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_type.lower() in ['doc', 'docx']:
        return extract_text_from_doc(file_path)
    else:
        print(f"Unsupported file type: {file_type}")
        return ""

def process_meeting_files(workspace_id, meeting_id, uploaded_files):
    """Process uploaded meeting files and extract text content"""
    meeting_dir = get_meeting_upload_dir(workspace_id, meeting_id)
    extracted_contents = []
    
    for file in uploaded_files:
        if file.filename:
            # Save file to meeting directory
            file_path = os.path.join(meeting_dir, file.filename)
            file.save(file_path)
            
            # Determine file type
            file_extension = os.path.splitext(file.filename)[1].lower()
            if file_extension == '.pdf':
                file_type = 'pdf'
            elif file_extension in ['.doc', '.docx']:
                file_type = 'doc'
            else:
                print(f"Unsupported file type: {file_extension}")
                continue
            
            # Extract text content
            extracted_content = extract_meeting_content(file_path, file_type)
            
            # Debug: Print extracted content length and preview
            print(f"Extracted {len(extracted_content)} characters from {file.filename}")
            if extracted_content:
                preview = extracted_content[:200] + "..." if len(extracted_content) > 200 else extracted_content
                print(f"Content preview: {preview}")
            
            extracted_contents.append({
                'filename': file.filename,
                'file_path': file_path,
                'file_type': file_type,
                'extracted_content': extracted_content
            })
    
    return extracted_contents

def combine_meeting_content(extracted_contents):
    """Combine all extracted meeting content into a single string"""
    combined_content = ""
    for content in extracted_contents:
        combined_content += f"\n--- Meeting File: {content['filename']} ---\n"
        combined_content += content['extracted_content']
        combined_content += "\n"
    return combined_content
