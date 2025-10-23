# Workspace Management & SOW Generation Application

A full-stack React + Flask application with SQLite database for managing Salesforce implementation workspaces, processing uploaded documents via Azure OpenAI GPT, and displaying formatted Statement of Work (SOW) pages.

## Features

- **Workspace Management**: Create, edit, and delete workspaces with Salesforce license selection
- **File Upload & Processing**: Upload PDF and DOC files for document analysis
- **GPT-Powered Analysis**: Extract scope, modules, stakeholders, and license information using Azure OpenAI
- **SOW Display**: Rich formatted display of extracted information with navigation
- **Dark Theme UI**: Modern, responsive interface with Material-UI components

## Project Structure

```
cursor_test_3/
├── backend/                    # Flask API backend
│   ├── app.py                  # Flask application entry point
│   ├── constants.py            # Configuration and GPT system prompt
│   ├── gpt_utils.py            # GPT utility functions
│   ├── database.py             # SQLite database initialization
│   ├── models.py               # Database models and CRUD operations
│   ├── routes.py               # API endpoints
│   ├── file_processor.py      # File extraction (PDF/DOC)
│   ├── sow_processor.py        # GPT processing for SOW extraction
│   ├── requirements.txt        # Python dependencies
│   └── workspace.db            # SQLite database (auto-generated)
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API service layer
│   │   ├── App.js             # Main application with routing
│   │   └── App.css            # Global styles
│   └── package.json           # Node.js dependencies
└── README.md                  # This file
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Flask application:**
   ```bash
   python app.py
   ```
   
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```
   
   The frontend will be available at `http://localhost:3000`

## Usage

### Creating a Workspace

1. Click "Create New Workspace" button
2. Fill in workspace details:
   - **Workspace Name**: Enter a descriptive name
   - **Relevant Products**: Select Salesforce licenses (multi-select)
   - **Project Type**: Choose "Greenfield" or "Enhancement"
3. Click "Create" to save the workspace

### Uploading Files

1. Click the three-dot menu on any workspace card
2. Select "Upload Files"
3. Drag and drop or select PDF/DOC/DOCX files
4. Click "Upload & Process" to start GPT analysis
5. Wait for processing to complete (loading indicator will show)

### Viewing SOW

1. Click on a workspace card (if files have been uploaded)
2. Navigate through the SOW sections:
   - **Scope**: In-scope and out-of-scope items
   - **Modules**: Business modules and processes
   - **Stakeholders**: Business units and stakeholder details
   - **Licenses**: Salesforce license inventory

## API Endpoints

### Workspaces
- `GET /api/workspaces` - List all workspaces
- `POST /api/workspaces` - Create new workspace
- `GET /api/workspaces/<id>` - Get workspace by ID
- `PUT /api/workspaces/<id>` - Update workspace
- `DELETE /api/workspaces/<id>` - Delete workspace

### File Upload & Processing
- `POST /api/workspaces/<id>/upload` - Upload files and trigger processing
- `GET /api/workspaces/<id>/sow` - Get SOW data for workspace

### Licenses
- `GET /api/licenses` - Get predefined Salesforce license list

## Database Schema

### Tables

**workspaces**
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT NOT NULL)
- `salesforce_licenses` (TEXT) - JSON array
- `project_type` (TEXT)
- `has_files` (INTEGER) - Boolean flag
- `processing_status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**workspace_files**
- `id` (INTEGER PRIMARY KEY)
- `workspace_id` (INTEGER FOREIGN KEY)
- `filename` (TEXT NOT NULL)
- `file_path` (TEXT NOT NULL)
- `file_type` (TEXT)
- `extracted_content` (TEXT)
- `uploaded_at` (TIMESTAMP)

**workspace_sow**
- `id` (INTEGER PRIMARY KEY)
- `workspace_id` (INTEGER UNIQUE FOREIGN KEY)
- `scope_summary` (TEXT) - JSON object
- `modules` (TEXT) - JSON array
- `business_units` (TEXT) - JSON array
- `salesforce_licenses_extracted` (TEXT) - JSON array
- `assumptions` (TEXT) - JSON array
- `validation_summary` (TEXT) - JSON object
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Configuration

### Azure OpenAI Setup

The application uses the existing Azure OpenAI configuration in `backend/constants.py`. Ensure your Azure OpenAI credentials are properly configured.

### File Storage

Uploaded files are stored in `backend/uploads/<workspace_id>/` directory.

### Supported File Types

- PDF files (.pdf)
- Microsoft Word documents (.doc, .docx)

## Troubleshooting

### Common Issues

1. **Backend not starting**: Check if all Python dependencies are installed
2. **Frontend not loading**: Ensure Node.js dependencies are installed
3. **File upload fails**: Check file size limits and supported formats
4. **GPT processing fails**: Verify Azure OpenAI configuration

### Error Messages

- "Upload files first to view SOW": No files have been uploaded for the workspace
- "Failed to generate valid SOW data": GPT processing failed or returned invalid data
- "No SOW data found": Workspace exists but SOW hasn't been generated yet

## Development

### Adding New Features

1. **Backend**: Add new routes in `routes.py` and corresponding models in `models.py`
2. **Frontend**: Create new components in `frontend/src/components/`
3. **Database**: Update schema in `database.py` and models in `models.py`

### Testing

1. **Backend**: Test API endpoints using tools like Postman
2. **Frontend**: Test UI components and user workflows
3. **Integration**: Test complete workflow from workspace creation to SOW display

## License

This project is for internal use only.