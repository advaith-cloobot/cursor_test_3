import json
from database import get_db_connection
from datetime import datetime

class WorkspaceModel:
    @staticmethod
    def create(name, salesforce_licenses, project_type):
        """Create a new workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO workspaces (name, salesforce_licenses, project_type)
            VALUES (?, ?, ?)
        ''', (name, json.dumps(salesforce_licenses), project_type))
        
        workspace_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return workspace_id
    
    @staticmethod
    def get_all():
        """Get all workspaces"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM workspaces ORDER BY created_at DESC')
        workspaces = cursor.fetchall()
        conn.close()
        
        result = []
        for workspace in workspaces:
            result.append({
                'id': workspace['id'],
                'name': workspace['name'],
                'salesforce_licenses': json.loads(workspace['salesforce_licenses']) if workspace['salesforce_licenses'] else [],
                'project_type': workspace['project_type'],
                'has_files': bool(workspace['has_files']),
                'processing_status': workspace['processing_status'],
                'created_at': workspace['created_at'],
                'updated_at': workspace['updated_at']
            })
        return result
    
    @staticmethod
    def get_by_id(workspace_id):
        """Get workspace by ID"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM workspaces WHERE id = ?', (workspace_id,))
        workspace = cursor.fetchone()
        conn.close()
        
        if workspace:
            return {
                'id': workspace['id'],
                'name': workspace['name'],
                'salesforce_licenses': json.loads(workspace['salesforce_licenses']) if workspace['salesforce_licenses'] else [],
                'project_type': workspace['project_type'],
                'has_files': bool(workspace['has_files']),
                'processing_status': workspace['processing_status'],
                'created_at': workspace['created_at'],
                'updated_at': workspace['updated_at']
            }
        return None
    
    @staticmethod
    def update(workspace_id, name=None, salesforce_licenses=None, project_type=None):
        """Update workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        updates = []
        params = []
        
        if name is not None:
            updates.append('name = ?')
            params.append(name)
        if salesforce_licenses is not None:
            updates.append('salesforce_licenses = ?')
            params.append(json.dumps(salesforce_licenses))
        if project_type is not None:
            updates.append('project_type = ?')
            params.append(project_type)
        
        updates.append('updated_at = CURRENT_TIMESTAMP')
        params.append(workspace_id)
        
        cursor.execute(f'''
            UPDATE workspaces 
            SET {', '.join(updates)}
            WHERE id = ?
        ''', params)
        
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
    
    @staticmethod
    def delete(workspace_id):
        """Delete workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM workspaces WHERE id = ?', (workspace_id,))
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
    
    @staticmethod
    def update_processing_status(workspace_id, status):
        """Update workspace processing status"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE workspaces 
            SET processing_status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (status, workspace_id))
        
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
    
    @staticmethod
    def set_has_files(workspace_id, has_files=True):
        """Set has_files flag for workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE workspaces 
            SET has_files = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (1 if has_files else 0, workspace_id))
        
        conn.commit()
        conn.close()
        return cursor.rowcount > 0

class WorkspaceFileModel:
    @staticmethod
    def create(workspace_id, filename, file_path, file_type, extracted_content):
        """Create a new workspace file record"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO workspace_files (workspace_id, filename, file_path, file_type, extracted_content)
            VALUES (?, ?, ?, ?, ?)
        ''', (workspace_id, filename, file_path, file_type, extracted_content))
        
        file_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return file_id
    
    @staticmethod
    def get_by_workspace_id(workspace_id):
        """Get all files for a workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM workspace_files WHERE workspace_id = ?', (workspace_id,))
        files = cursor.fetchall()
        conn.close()
        
        result = []
        for file in files:
            result.append({
                'id': file['id'],
                'workspace_id': file['workspace_id'],
                'filename': file['filename'],
                'file_path': file['file_path'],
                'file_type': file['file_type'],
                'extracted_content': file['extracted_content'],
                'uploaded_at': file['uploaded_at']
            })
        return result
    
    @staticmethod
    def delete_by_workspace_id(workspace_id):
        """Delete all files for a workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM workspace_files WHERE workspace_id = ?', (workspace_id,))
        conn.commit()
        conn.close()
        return cursor.rowcount > 0

class WorkspaceSOWModel:
    @staticmethod
    def create(workspace_id, scope_summary, modules, business_units, salesforce_licenses_extracted, assumptions, validation_summary):
        """Create SOW data for workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO workspace_sow (workspace_id, scope_summary, modules, business_units, 
                                     salesforce_licenses_extracted, assumptions, validation_summary)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (workspace_id, json.dumps(scope_summary), json.dumps(modules), 
              json.dumps(business_units), json.dumps(salesforce_licenses_extracted), 
              json.dumps(assumptions), json.dumps(validation_summary)))
        
        sow_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return sow_id
    
    @staticmethod
    def get_by_workspace_id(workspace_id):
        """Get SOW data for workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM workspace_sow WHERE workspace_id = ?', (workspace_id,))
        sow = cursor.fetchone()
        conn.close()
        
        if sow:
            return {
                'id': sow['id'],
                'workspace_id': sow['workspace_id'],
                'scope_summary': json.loads(sow['scope_summary']) if sow['scope_summary'] else {},
                'modules': json.loads(sow['modules']) if sow['modules'] else [],
                'business_units': json.loads(sow['business_units']) if sow['business_units'] else [],
                'salesforce_licenses_extracted': json.loads(sow['salesforce_licenses_extracted']) if sow['salesforce_licenses_extracted'] else [],
                'assumptions': json.loads(sow['assumptions']) if sow['assumptions'] else [],
                'validation_summary': json.loads(sow['validation_summary']) if sow['validation_summary'] else {},
                'created_at': sow['created_at'],
                'updated_at': sow['updated_at']
            }
        return None
    
    @staticmethod
    def update(workspace_id, scope_summary=None, modules=None, business_units=None, 
               salesforce_licenses_extracted=None, assumptions=None, validation_summary=None):
        """Update SOW data"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        updates = []
        params = []
        
        if scope_summary is not None:
            updates.append('scope_summary = ?')
            params.append(json.dumps(scope_summary))
        if modules is not None:
            updates.append('modules = ?')
            params.append(json.dumps(modules))
        if business_units is not None:
            updates.append('business_units = ?')
            params.append(json.dumps(business_units))
        if salesforce_licenses_extracted is not None:
            updates.append('salesforce_licenses_extracted = ?')
            params.append(json.dumps(salesforce_licenses_extracted))
        if assumptions is not None:
            updates.append('assumptions = ?')
            params.append(json.dumps(assumptions))
        if validation_summary is not None:
            updates.append('validation_summary = ?')
            params.append(json.dumps(validation_summary))
        
        updates.append('updated_at = CURRENT_TIMESTAMP')
        params.append(workspace_id)
        
        cursor.execute(f'''
            UPDATE workspace_sow 
            SET {', '.join(updates)}
            WHERE workspace_id = ?
        ''', params)
        
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
    
    @staticmethod
    def delete_by_workspace_id(workspace_id):
        """Delete SOW data for workspace"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM workspace_sow WHERE workspace_id = ?', (workspace_id,))
        conn.commit()
        conn.close()
        return cursor.rowcount > 0
