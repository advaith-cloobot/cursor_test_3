import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuList,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { meetingAPI } from '../services/api';
import CreateMeetingDialog from './CreateMeetingDialog';
import EditMeetingDialog from './EditMeetingDialog';

const MeetingManagementPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  useEffect(() => {
    loadMeetings();
  }, [workspaceId]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const response = await meetingAPI.getAll(workspaceId);
      if (response.data.success) {
        setMeetings(response.data.data);
      } else {
        setError('Failed to load meetings');
      }
    } catch (err) {
      setError('Error loading meetings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/workspace/${workspaceId}`);
  };

  const handleCreateMeeting = () => {
    setCreateDialogOpen(true);
  };

  const handleEditMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setEditDialogOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        const response = await meetingAPI.delete(meetingId);
        if (response.data.success) {
          loadMeetings();
        } else {
          setError('Failed to delete meeting');
        }
      } catch (err) {
        setError('Error deleting meeting: ' + err.message);
      }
    }
    setAnchorEl(null);
  };

  const handleViewMeeting = (meetingId) => {
    navigate(`/meeting/${meetingId}/details`);
  };

  const handleMenuOpen = (event, meetingId) => {
    setAnchorEl(event.currentTarget);
    setSelectedMeetingId(meetingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMeetingId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Left Sidebar */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: 280, 
          bgcolor: 'background.paper', 
          p: 2, 
          borderRight: '1px solid #333',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack} 
          sx={{ mb: 2, justifyContent: 'flex-start' }}
        >
          Back to Workspace
        </Button>
        
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Meetings
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage meetings and extract insights from meeting files
        </Typography>
      </Paper>

      {/* Right Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Meeting Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateMeeting}
            sx={{
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              }
            }}
          >
            Create Meeting
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {meetings.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No meetings found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create your first meeting to get started
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateMeeting}
              >
                Create Meeting
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                      Meeting Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                      Date & Time
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                      Stakeholders
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                      Files
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow 
                      key={meeting.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover' 
                        },
                        '&:last-child td, &:last-child th': { 
                          border: 0 
                        }
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {meeting.meeting_name}
                          </Typography>
                          <IconButton
                            aria-label="settings"
                            onClick={(e) => handleMenuOpen(e, meeting.id)}
                            size="small"
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(meeting.meeting_date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {meeting.stakeholders.length} attendees
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={meeting.processing_status}
                          color={getStatusColor(meeting.processing_status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {meeting.has_files ? (
                          <Chip 
                            label="Files uploaded"
                            color="info"
                            size="small"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No files
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewMeeting(meeting.id)}
                          disabled={!meeting.has_files}
                          sx={{ 
                            minWidth: 140,
                            backgroundColor: meeting.has_files ? 'primary.main' : 'action.disabledBackground',
                            color: meeting.has_files ? 'primary.contrastText' : 'text.disabled',
                            '&:hover': {
                              backgroundColor: meeting.has_files ? 'primary.dark' : 'action.disabledBackground',
                            },
                            '&:disabled': {
                              backgroundColor: 'action.disabledBackground',
                              color: 'text.disabled'
                            }
                          }}
                        >
                          {meeting.has_files ? 'View Details' : 'Upload Files First'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {
            const meeting = meetings.find(m => m.id === selectedMeetingId);
            if (meeting) handleEditMeeting(meeting);
          }}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => handleDeleteMeeting(selectedMeetingId)}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </Box>

      {/* Create Meeting Dialog */}
      <CreateMeetingDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        workspaceId={workspaceId}
        onSuccess={() => {
          setCreateDialogOpen(false);
          loadMeetings();
        }}
      />

      {/* Edit Meeting Dialog */}
      <EditMeetingDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedMeeting(null);
        }}
        meeting={selectedMeeting}
        onSuccess={() => {
          setEditDialogOpen(false);
          setSelectedMeeting(null);
          loadMeetings();
        }}
      />
    </Box>
  );
};

export default MeetingManagementPage;
