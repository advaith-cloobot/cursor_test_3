import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import WorkspaceCard from './WorkspaceCard';
import CreateWorkspaceDialog from './CreateWorkspaceDialog';
import FileUploadDialog from './FileUploadDialog';
import { workspaceAPI } from '../services/api';

const WorkspaceGrid = () => {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);
  const [workspaceToEdit, setWorkspaceToEdit] = useState(null);

  // Fetch workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await workspaceAPI.getAll();
      if (response.data.success) {
        setWorkspaces(response.data.data);
      } else {
        setError('Failed to fetch workspaces');
      }
    } catch (err) {
      setError('Error fetching workspaces: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  // Create workspace
  const handleCreateWorkspace = async (workspaceData) => {
    try {
      const response = await workspaceAPI.create(workspaceData);
      if (response.data.success) {
        setCreateDialogOpen(false);
        fetchWorkspaces(); // Refresh the list
      } else {
        setError('Failed to create workspace');
      }
    } catch (err) {
      setError('Error creating workspace: ' + (err.response?.data?.error || err.message));
    }
  };

  // Edit workspace
  const handleEditWorkspace = (workspace) => {
    setWorkspaceToEdit(workspace);
    setCreateDialogOpen(true);
  };

  const handleUpdateWorkspace = async (workspaceData) => {
    try {
      const response = await workspaceAPI.update(workspaceToEdit.id, workspaceData);
      if (response.data.success) {
        setCreateDialogOpen(false);
        setWorkspaceToEdit(null);
        fetchWorkspaces(); // Refresh the list
      } else {
        setError('Failed to update workspace');
      }
    } catch (err) {
      setError('Error updating workspace: ' + (err.response?.data?.error || err.message));
    }
  };

  // Delete workspace
  const handleDeleteWorkspace = (workspaceId) => {
    setWorkspaceToDelete(workspaceId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteWorkspace = async () => {
    try {
      const response = await workspaceAPI.delete(workspaceToDelete);
      if (response.data.success) {
        setDeleteDialogOpen(false);
        setWorkspaceToDelete(null);
        fetchWorkspaces(); // Refresh the list
      } else {
        setError('Failed to delete workspace');
      }
    } catch (err) {
      setError('Error deleting workspace: ' + (err.response?.data?.error || err.message));
    }
  };

  // Upload files
  const handleUploadFiles = (workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
    setUploadDialogOpen(true);
  };

  const handleFileUpload = async (files) => {
    try {
      const response = await workspaceAPI.uploadFiles(selectedWorkspaceId, files);
      if (response.data.success) {
        setUploadDialogOpen(false);
        setSelectedWorkspaceId(null);
        fetchWorkspaces(); // Refresh the list
        // Navigate to SOW page after successful upload
        window.location.href = `/sow/${selectedWorkspaceId}`;
      } else {
        setError('Failed to upload files: ' + response.data.error);
      }
    } catch (err) {
      setError('Error uploading files: ' + (err.response?.data?.error || err.message));
    }
  };

  // View SOW
  const handleViewSOW = (workspaceId) => {
    window.location.href = `/sow/${workspaceId}`;
  };

  const handleViewMeetings = (workspaceId) => {
    navigate(`/workspace/${workspaceId}/meetings`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Workspaces
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }}
        >
          Create New Workspace
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Workspaces Grid */}
      <Grid container spacing={3}>
        {workspaces.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider'
            }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No workspaces found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first workspace to get started
              </Typography>
            </Box>
          </Grid>
        ) : (
          workspaces.map((workspace) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={workspace.id}>
              <WorkspaceCard
                workspace={workspace}
                onEdit={handleEditWorkspace}
                onDelete={handleDeleteWorkspace}
                onUpload={handleUploadFiles}
                onViewSOW={handleViewSOW}
                onViewMeetings={handleViewMeetings}
              />
            </Grid>
          ))
        )}
      </Grid>

      {/* Create/Edit Workspace Dialog */}
      <CreateWorkspaceDialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setWorkspaceToEdit(null);
        }}
        onSubmit={workspaceToEdit ? handleUpdateWorkspace : handleCreateWorkspace}
        workspace={workspaceToEdit}
      />

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => {
          setUploadDialogOpen(false);
          setSelectedWorkspaceId(null);
        }}
        onSubmit={handleFileUpload}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Workspace
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this workspace? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteWorkspace} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspaceGrid;
