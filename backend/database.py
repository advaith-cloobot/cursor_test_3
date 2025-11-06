import sqlite3
import os
from datetime import datetime

DATABASE_PATH = 'workspace.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initialize database with required tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create workspaces table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workspaces (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            salesforce_licenses TEXT,
            project_type TEXT,
            has_files INTEGER DEFAULT 0,
            processing_status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create workspace_files table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workspace_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT,
            extracted_content TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE
        )
    ''')
    
    # Create workspace_sow table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS workspace_sow (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER UNIQUE NOT NULL,
            scope_summary TEXT,
            modules TEXT,
            business_units TEXT,
            salesforce_licenses_extracted TEXT,
            assumptions TEXT,
            validation_summary TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE
        )
    ''')
    
    # Create meetings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workspace_id INTEGER NOT NULL,
            meeting_name TEXT NOT NULL,
            stakeholders TEXT,
            meeting_date DATETIME NOT NULL,
            meeting_details TEXT,
            has_files INTEGER DEFAULT 0,
            processing_status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE
        )
    ''')
    
    # Create meeting_files table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meeting_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT,
            extracted_content TEXT,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id) ON DELETE CASCADE
        )
    ''')
    
    # Create meeting_extracted_values table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS meeting_extracted_values (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER NOT NULL,
            value_type TEXT NOT NULL,
            value_data TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (meeting_id) REFERENCES meetings (id) ON DELETE CASCADE
        )
    ''')
    
    # Create indexes for performance
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_meetings_workspace 
        ON meetings(workspace_id)
    ''')
    
    cursor.execute('''
        CREATE INDEX IF NOT EXISTS idx_meeting_values_lookup 
        ON meeting_extracted_values(meeting_id, value_type)
    ''')
    
    conn.commit()
    conn.close()

def create_uploads_directory():
    """Create uploads directory if it doesn't exist"""
    uploads_dir = 'uploads'
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)

def get_workspace_upload_dir(workspace_id):
    """Get workspace-specific upload directory"""
    workspace_dir = os.path.join('uploads', str(workspace_id))
    if not os.path.exists(workspace_dir):
        os.makedirs(workspace_dir)
    return workspace_dir

def get_meeting_upload_dir(workspace_id, meeting_id):
    """Get meeting-specific upload directory"""
    meeting_dir = os.path.join('uploads', str(workspace_id), 'meetings', str(meeting_id))
    if not os.path.exists(meeting_dir):
        os.makedirs(meeting_dir)
    return meeting_dir
