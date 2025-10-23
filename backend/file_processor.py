import os
import PyPDF2
from docx import Document
from database import get_workspace_upload_dir

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text.strip():  # Only add non-empty pages
                    text += f"\n--- PAGE {page_num + 1} ---\n"
                    text += page_text + "\n"
            return text
    except Exception as e:
        print(f"Error extracting text from PDF {file_path}: {str(e)}")
        return ""

def extract_text_from_doc(file_path):
    """Extract text from DOC/DOCX file including tables"""
    try:
        doc = Document(file_path)
        text = ""
        
        # Extract text from paragraphs
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():  # Only add non-empty paragraphs
                text += paragraph.text + "\n"
        
        # Extract text from tables
        for table_idx, table in enumerate(doc.tables):
            text += f"\n--- TABLE {table_idx + 1} START ---\n"
            for row_idx, row in enumerate(table.rows):
                row_text = []
                for cell in row.cells:
                    cell_text = cell.text.strip()
                    if cell_text:
                        row_text.append(cell_text)
                if row_text:  # Only add non-empty rows
                    text += " | ".join(row_text) + "\n"
            text += f"--- TABLE {table_idx + 1} END ---\n"
        
        return text
    except Exception as e:
        print(f"Error extracting text from DOC {file_path}: {str(e)}")
        return ""

def extract_text_from_file(file_path, file_type):
    """Extract text from file based on type"""
    if file_type.lower() == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_type.lower() in ['doc', 'docx']:
        return extract_text_from_doc(file_path)
    else:
        print(f"Unsupported file type: {file_type}")
        return ""

def process_uploaded_files(workspace_id, uploaded_files):
    """Process uploaded files and extract text content"""
    workspace_dir = get_workspace_upload_dir(workspace_id)
    extracted_contents = []
    
    for file in uploaded_files:
        if file.filename:
            # Save file to workspace directory
            file_path = os.path.join(workspace_dir, file.filename)
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
            extracted_content = extract_text_from_file(file_path, file_type)
            
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

def combine_extracted_content(extracted_contents):
    """Combine all extracted content into a single string"""
    combined_content = ""
    for content in extracted_contents:
        combined_content += f"\n--- File: {content['filename']} ---\n"
        combined_content += content['extracted_content']
        combined_content += "\n"
    return combined_content
