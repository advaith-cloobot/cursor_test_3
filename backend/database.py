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
