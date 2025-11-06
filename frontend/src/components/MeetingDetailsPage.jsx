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
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  FileDownload as ExportIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Assignment as RequirementsIcon,
  Warning as RisksIcon,
  CheckCircle as DecisionsIcon,
  CheckCircle,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { meetingAPI } from '../services/api';

const MeetingDetailsPage = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [extractedValues, setExtractedValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('overview');

  useEffect(() => {
    loadMeetingData();
  }, [meetingId]);

  const loadMeetingData = async () => {
    try {
      setLoading(true);
      
      // Load meeting details
      const meetingResponse = await meetingAPI.getById(meetingId);
      if (meetingResponse.data.success) {
        setMeeting(meetingResponse.data.data);
      } else {
        setError('Failed to load meeting details');
        return;
      }

      // Load extracted values
      const valuesResponse = await meetingAPI.getValues(meetingId);
      if (valuesResponse.data.success) {
        setExtractedValues(valuesResponse.data.data);
      }
    } catch (err) {
      setError('Error loading meeting data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
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

  const renderOverviewContent = () => {
    if (!meeting) return null;

    return (
      <Box>
        {/* Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {meeting.meeting_details || 'No description provided'}
          </Typography>
        </Box>

        {/* Objectives */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Objectives
          </Typography>
          <List>
            {[
              'Document all business requirements for Phase 1',
              'Identify potential integration challenges',
              'Establish security and compliance requirements',
              'Define acceptance criteria for key features'
            ].map((objective, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary={objective} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Agenda */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Agenda
          </Typography>
          <List>
            {[
              { item: 'Review current system architecture', duration: '30 min' },
              { item: 'Identify integration requirements', duration: '30 min' },
              { item: 'Discuss security protocols', duration: '25 min' },
              { item: 'Define success criteria', duration: '15 min' }
            ].map((agenda, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={agenda.item}
                  secondary={agenda.duration}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Attendees */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Attendees
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {meeting.stakeholders.length} stakeholders selected
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderRequirementsContent = () => {
    const requirements = extractedValues.V5 || [];
    
    if (requirements.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No requirements extracted yet
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Requirements ({requirements.length})
        </Typography>
        
        <Grid container spacing={3}>
          {requirements.map((req, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      label={req.requirement_type || 'Functional'} 
                      color={req.requirement_type === 'functional' ? 'primary' : 'secondary'}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {req.description_md}
                  </Typography>
                  {req.acceptance_criteria && req.acceptance_criteria.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Acceptance Criteria:
                      </Typography>
                      <List dense>
                        {req.acceptance_criteria.map((criteria, idx) => (
                          <ListItem key={idx} sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={criteria}
                              sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderActionItemsContent = () => {
    const actionItems = extractedValues.V7 || [];
    
    if (actionItems.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No action items extracted yet
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Action Items ({actionItems.length})
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Owner</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actionItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.task_md}</TableCell>
                  <TableCell>{item.owner_md}</TableCell>
                  <TableCell>{item.due_date || 'Not specified'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={item.status || 'open'} 
                      color={item.status === 'done' ? 'success' : item.status === 'in-progress' ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderDecisionsContent = () => {
    const decisions = extractedValues.V8 || [];
    
    if (decisions.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No decisions extracted yet
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Decisions ({decisions.length})
        </Typography>
        
        <Grid container spacing={3}>
          {decisions.map((decision, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {decision.decision_md}
                  </Typography>
                  {decision.rationale_md && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Rationale:</strong> {decision.rationale_md}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {decision.approver_md && (
                      <Chip 
                        label={`Approved by: ${decision.approver_md}`}
                        color="success"
                        size="small"
                      />
                    )}
                    {decision.decided_on && (
                      <Chip 
                        label={`Decided: ${decision.decided_on}`}
                        color="info"
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderRisksContent = () => {
    const risks = extractedValues.V6 || [];
    
    if (risks.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No risks or issues extracted yet
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Risks & Issues ({risks.length})
        </Typography>
        
        <Grid container spacing={3}>
          {risks.map((risk, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      label={risk.type || 'Risk'} 
                      color={risk.type === 'issue' ? 'error' : 'warning'}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                  </Box>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {risk.description_md}
                  </Typography>
                  {risk.impact_md && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Impact:</strong> {risk.impact_md}
                    </Typography>
                  )}
                  {risk.mitigation_md && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <strong>Mitigation:</strong> {risk.mitigation_md}
                    </Typography>
                  )}
                  {risk.owner_md && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Owner:</strong> {risk.owner_md}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'overview':
        return renderOverviewContent();
      case 'requirements':
        return renderRequirementsContent();
      case 'actions':
        return renderActionItemsContent();
      case 'decisions':
        return renderDecisionsContent();
      case 'risks':
        return renderRisksContent();
      default:
        return renderOverviewContent();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!meeting) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Meeting not found</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack} 
            sx={{ mb: 2, justifyContent: 'flex-start' }}
          >
            Back to Meetings
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mr: 2 }}>
                  {meeting.meeting_name}
                </Typography>
                <Chip 
                  label={meeting.processing_status}
                  color={getStatusColor(meeting.processing_status)}
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{formatDate(meeting.meeting_date)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TimeIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{formatTime(meeting.meeting_date)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2">{meeting.stakeholders.length} attendees</Typography>
                </Box>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mr: 1 }}
              >
                Edit Meeting
              </Button>
              <Button
                variant="outlined"
                startIcon={<ExportIcon />}
              >
                Export
              </Button>
            </Box>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #333' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <RequirementsIcon sx={{ fontSize: 24, mb: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {(extractedValues.V5 || []).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Requirements
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #333' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <CheckCircle sx={{ fontSize: 24, mb: 1, color: 'success.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {(extractedValues.V7 || []).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Action Items
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #333' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <DecisionsIcon sx={{ fontSize: 24, mb: 1, color: 'info.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {(extractedValues.V8 || []).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Decisions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card sx={{ backgroundColor: 'background.paper', border: '1px solid #333' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <RisksIcon sx={{ fontSize: 24, mb: 1, color: 'warning.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {(extractedValues.V6 || []).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Risks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'requirements', label: 'Requirements' },
                { id: 'actions', label: 'Actions' },
                { id: 'decisions', label: 'Decisions' },
                { id: 'risks', label: 'Risks' }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setSelectedSection(tab.id)}
                  sx={{
                    color: selectedSection === tab.id ? 'primary.main' : 'text.secondary',
                    borderBottom: selectedSection === tab.id ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    px: 2,
                    py: 1
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        {renderContent()}
      </Box>

      {/* Right Sidebar */}
      <Paper 
        elevation={3} 
        sx={{ 
          width: 300, 
          bgcolor: 'background.paper', 
          p: 2, 
          borderLeft: '1px solid #333',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Meeting Details */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Meeting Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              <strong>Organizer:</strong> Sarah Chen
            </Typography>
            <Typography variant="body2">
              <strong>Duration:</strong> 1h 30m
            </Typography>
            <Typography variant="body2">
              <strong>Location:</strong> Conference Room A / Zoom
            </Typography>
          </Box>
        </Box>

        {/* Follow-up */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Follow-up
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              <strong>Next Meeting:</strong> 2025-01-27
            </Typography>
            <Typography variant="body2" color="warning.main">
              <strong>Pending Actions:</strong> {(extractedValues.V7 || []).length} items
            </Typography>
            <Typography variant="body2" color="error.main">
              <strong>Pending Decisions:</strong> {(extractedValues.V8 || []).length} decisions
            </Typography>
          </Box>
        </Box>

        {/* Recordings */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recordings
          </Typography>
          <List>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <PlayIcon />
              </ListItemIcon>
              <ListItemText primary="Video Recording" />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon>
                <PlayIcon />
              </ListItemIcon>
              <ListItemText primary="Audio Recording" />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default MeetingDetailsPage;
