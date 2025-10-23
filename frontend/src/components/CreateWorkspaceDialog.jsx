import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput,
  Typography
} from '@mui/material';
import { licenseAPI } from '../services/api';

const CreateWorkspaceDialog = ({ open, onClose, onSubmit, workspace }) => {
  const [formData, setFormData] = useState({
    name: '',
    salesforce_licenses: [],
    project_type: ''
  });
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch available licenses
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await licenseAPI.getAll();
        if (response.data.success) {
          setLicenses(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching licenses:', err);
      }
    };
    fetchLicenses();
  }, []);

  // Initialize form data when workspace is provided (edit mode)
  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name || '',
        salesforce_licenses: workspace.salesforce_licenses || [],
        project_type: workspace.project_type || ''
      });
    } else {
      setFormData({
        name: '',
        salesforce_licenses: [],
        project_type: ''
      });
    }
    setErrors({});
  }, [workspace, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleLicenseChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      salesforce_licenses: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Workspace name is required';
    }
    
    if (!formData.project_type) {
      newErrors.project_type = 'Project type is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        salesforce_licenses: [],
        project_type: ''
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      salesforce_licenses: [],
      project_type: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {workspace ? 'Edit Workspace' : 'Create New Workspace'}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Workspace Name */}
          <TextField
            label="Workspace Name"
            value={formData.name}
            onChange={handleChange('name')}
            fullWidth
            error={!!errors.name}
            helperText={errors.name}
            placeholder="Enter a name for workspace here"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default'
              }
            }}
          />

          {/* Salesforce Licenses */}
          <FormControl fullWidth error={!!errors.salesforce_licenses}>
            <InputLabel>Relevant Products</InputLabel>
            <Select
              multiple
              value={formData.salesforce_licenses}
              onChange={handleLicenseChange}
              input={<OutlinedInput label="Relevant Products" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.default'
                }
              }}
            >
              {licenses.map((license) => (
                <MenuItem key={license} value={license}>
                  {license}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Project Type */}
          <FormControl fullWidth error={!!errors.project_type}>
            <InputLabel>Project Type</InputLabel>
            <Select
              value={formData.project_type}
              onChange={handleChange('project_type')}
              label="Project Type"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.default'
                }
              }}
            >
              <MenuItem value="Greenfield">Greenfield</MenuItem>
              <MenuItem value="Enhancement">Enhancement</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
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
          {loading ? 'Saving...' : (workspace ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
