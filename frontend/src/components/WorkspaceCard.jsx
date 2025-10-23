import React, { useState } from 'react';
import {
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  Button
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Upload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const WorkspaceCard = ({ 
  workspace, 
  onEdit, 
  onDelete, 
  onUpload, 
  onViewSOW 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewSOW = () => {
    onViewSOW(workspace.id);
  };

  const handleUpload = () => {
    onUpload(workspace.id);
    handleMenuClose();
  };

  const handleEdit = () => {
    onEdit(workspace);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(workspace.id);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: 3,
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h2" sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              mr: 1
            }}>
              {workspace.name}
            </Typography>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleMenuOpen(e);
              }}
              sx={{ 
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={workspace.project_type}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Chip
              label={workspace.processing_status}
              size="small"
              color={getStatusColor(workspace.processing_status)}
              variant="filled"
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Licenses: {workspace.salesforce_licenses.length}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {workspace.has_files ? 'Files uploaded' : 'No files uploaded'}
          </Typography>

          {/* View SOW Button */}
          <Button
            variant="contained"
            size="small"
            fullWidth
            onClick={handleViewSOW}
            disabled={!workspace.has_files}
            sx={{
              backgroundColor: workspace.has_files ? 'primary.main' : 'action.disabledBackground',
              color: workspace.has_files ? 'primary.contrastText' : 'text.disabled',
              '&:hover': {
                backgroundColor: workspace.has_files ? 'primary.dark' : 'action.disabledBackground',
              },
              '&:disabled': {
                backgroundColor: 'action.disabledBackground',
                color: 'text.disabled'
              }
            }}
          >
            {workspace.has_files ? 'View SOW' : 'Upload Files First'}
          </Button>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleUpload}>
          <UploadIcon sx={{ mr: 1 }} />
          Upload Files
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleViewSOW}>
          <VisibilityIcon sx={{ mr: 1 }} />
          View SOW
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

    </>
  );
};

export default WorkspaceCard;
