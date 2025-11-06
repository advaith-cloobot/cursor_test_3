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
  Chip,
  OutlinedInput
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { meetingAPI } from '../services/api';

const EditMeetingDialog = ({ open, onClose, meeting, onSuccess }) => {
  const [formData, setFormData] = useState({
    meeting_name: '',
    stakeholders: [],
    meeting_date: new Date(),
    meeting_details: ''
  });
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && meeting) {
      setFormData({
        meeting_name: meeting.meeting_name || '',
        stakeholders: meeting.stakeholders || [],
        meeting_date: meeting.meeting_date ? new Date(meeting.meeting_date) : new Date(),
        meeting_details: meeting.meeting_details || ''
      });
      loadStakeholders();
    }
  }, [open, meeting]);

  const loadStakeholders = async () => {
    try {
      const response = await meetingAPI.getStakeholders(meeting.workspace_id);
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

  const handleSubmit = async () => {
    if (!formData.meeting_name || !formData.meeting_date) {
      setError('Meeting name and date are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await meetingAPI.update(meeting.id, {
        meeting_name: formData.meeting_name,
        stakeholders: formData.stakeholders,
        meeting_date: formData.meeting_date.toISOString(),
        meeting_details: formData.meeting_details
      });

      if (response.data.success) {
        onSuccess();
        handleClose();
      } else {
        setError(response.data.error || 'Failed to update meeting');
      }
    } catch (err) {
      setError(err.message || 'Failed to update meeting');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      meeting_name: '',
      stakeholders: [],
      meeting_date: new Date(),
      meeting_details: ''
    });
    setError(null);
    onClose();
  };

  if (!meeting) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Edit Meeting
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

          {/* Error Display */}
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.meeting_name}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            '&:disabled': {
              backgroundColor: 'action.disabledBackground'
            }
          }}
        >
          {loading ? 'Updating...' : 'Update Meeting'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMeetingDialog;
