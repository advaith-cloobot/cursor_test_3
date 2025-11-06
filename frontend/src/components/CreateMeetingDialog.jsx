import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  LinearProgress,
  OutlinedInput
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { meetingAPI } from '../services/api';

const CreateMeetingDialog = ({ open, onClose, workspaceId, onSuccess }) => {
  const [formData, setFormData] = useState({
    meeting_name: '',
    stakeholders: [],
    meeting_date: new Date(),
    meeting_details: ''
  });
  const [files, setFiles] = useState([]);
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      loadStakeholders();
    }
  }, [open, workspaceId]);

  const loadStakeholders = async () => {
    try {
      const response = await meetingAPI.getStakeholders(workspaceId);
      if (response.data.success) {
        setStakeholders(response.data.data);
      }
    } catch (err) {
      console.error('Error loading stakeholders:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => {
      const fileType = file.name.split('.').pop().toLowerCase();
      return ['pdf', 'doc', 'docx'].includes(fileType);
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Only PDF, DOC, and DOCX files are allowed');
      return;
    }

    setFiles(prev => [...prev, ...validFiles]);
    setError(null);
  };

  const handleFileRemove = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.meeting_name || !formData.meeting_date) {
      setError('Meeting name and date are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create meeting
      const meetingResponse = await meetingAPI.create(workspaceId, {
        meeting_name: formData.meeting_name,
        stakeholders: formData.stakeholders,
        meeting_date: formData.meeting_date.toISOString(),
        meeting_details: formData.meeting_details
      });

      if (!meetingResponse.data.success) {
        throw new Error(meetingResponse.data.error || 'Failed to create meeting');
      }

      const meetingId = meetingResponse.data.data.id;

      // Upload files if any
      if (files.length > 0) {
        setUploading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        try {
          const uploadResponse = await meetingAPI.uploadFiles(meetingId, files);
          clearInterval(progressInterval);
          setUploadProgress(100);

          if (!uploadResponse.data.success) {
            throw new Error(uploadResponse.data.error || 'Failed to upload files');
          }

          setSuccess(true);
          setTimeout(() => {
            onSuccess();
            handleClose();
          }, 2000);
        } catch (uploadErr) {
          clearInterval(progressInterval);
          throw uploadErr;
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Failed to create meeting');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      meeting_name: '',
      stakeholders: [],
      meeting_date: new Date(),
      meeting_details: ''
    });
    setFiles([]);
    setError(null);
    setSuccess(false);
    setUploading(false);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create New Meeting
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Meeting Name */}
          <TextField
            label="Meeting Name"
            value={formData.meeting_name}
            onChange={(e) => handleInputChange('meeting_name', e.target.value)}
            fullWidth
            required
            variant="outlined"
          />

          {/* Stakeholders */}
          <FormControl fullWidth>
            <InputLabel>Stakeholders</InputLabel>
            <Select
              multiple
              value={formData.stakeholders}
              onChange={(e) => handleInputChange('stakeholders', e.target.value)}
              input={<OutlinedInput label="Stakeholders" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const stakeholder = stakeholders.find(s => s.id === value);
                    return (
                      <Chip 
                        key={value} 
                        label={stakeholder?.name || value} 
                        size="small" 
                      />
                    );
                  })}
                </Box>
              )}
            >
              {stakeholders.map((stakeholder) => (
                <MenuItem key={stakeholder.id} value={stakeholder.id}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stakeholder.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stakeholder.designation} - {stakeholder.business_unit}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date & Time */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Meeting Date & Time"
              value={formData.meeting_date}
              onChange={(newValue) => handleInputChange('meeting_date', newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>

          {/* Meeting Details */}
          <TextField
            label="Meeting Details"
            value={formData.meeting_details}
            onChange={(e) => handleInputChange('meeting_details', e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Enter meeting details, agenda, or notes..."
          />

          {/* File Upload */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Upload Meeting Files (Optional)
            </Typography>
            
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                border: '2px dashed',
                borderColor: 'primary.main',
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" sx={{ mb: 1 }}>
                Click to upload files or drag and drop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF, DOC, DOCX files are supported
              </Typography>
            </Paper>

            {/* File List */}
            {files.length > 0 && (
              <List sx={{ mt: 2 }}>
                {files.map((file, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <FileIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                    <IconButton
                      onClick={() => handleFileRemove(index)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* Error Display */}
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {/* Success Display */}
          {success && (
            <Alert severity="success" icon={<CheckIcon />}>
              Meeting created successfully! {files.length > 0 && 'Processing files...'}
            </Alert>
          )}

          {/* Upload Progress - Show in dialog when processing */}
          {uploading && (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4, 
              px: 3,
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              backgroundColor: 'action.hover',
              mb: 2
            }}>
              <CircularProgress 
                size={64} 
                sx={{ mb: 3, color: 'primary.main' }} 
              />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Processing Meeting Files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Extracting content and analyzing with AI...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4, 
                  backgroundColor: 'action.disabledBackground',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main'
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {uploadProgress}% complete
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={loading || uploading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || uploading || !formData.meeting_name}
          startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />}
          sx={{
            backgroundColor: uploading ? 'action.disabledBackground' : 'primary.main',
            color: uploading ? 'text.disabled' : 'primary.contrastText',
            '&:hover': {
              backgroundColor: uploading ? 'action.disabledBackground' : 'primary.dark',
            },
            '&:disabled': {
              backgroundColor: 'action.disabledBackground',
              color: 'text.disabled'
            }
          }}
        >
          {uploading ? 'Processing...' : loading ? 'Creating...' : 'Create Meeting'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMeetingDialog;
