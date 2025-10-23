import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ExpandMore as ExpandMoreIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  List as ListIcon
} from '@mui/icons-material';
import { workspaceAPI } from '../services/api';

const SOWPage = ({ workspaceId }) => {
  const [sowData, setSowData] = useState(null);
  const [selectedSection, setSelectedSection] = useState('scope');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSOWData();
  }, [workspaceId]);

  const fetchSOWData = async () => {
    try {
      setLoading(true);
      const response = await workspaceAPI.getSOW(workspaceId);
      if (response.data.success) {
        setSowData(response.data.data);
      } else {
        setError('Failed to fetch SOW data');
      }
    } catch (err) {
      setError('Error fetching SOW data: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  const renderScopeContent = () => {
    if (!sowData?.scope_summary) return null;

    const { in_scope = [], out_of_scope = [] } = sowData.scope_summary;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Project Scope
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
                  In Scope
                </Typography>
                <List dense>
                  {in_scope.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={item}
                        sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="error.main" sx={{ mb: 2, fontWeight: 600 }}>
                  Out of Scope
                </Typography>
                <List dense>
                  {out_of_scope.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={item}
                        sx={{ '& .MuiListItemText-primary': { fontSize: '0.9rem' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderModulesContent = () => {
    if (!sowData?.modules || sowData.modules.length === 0) return null;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Modules and Processes
        </Typography>
        
        <Grid container spacing={3}>
          {sowData.modules.map((module, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {module.module_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {module.description}
                  </Typography>
                  <Accordion sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        backgroundColor: 'action.hover',
                        borderRadius: 1,
                        px: 2,
                        minHeight: 48,
                        '&.Mui-expanded': {
                          minHeight: 48
                        }
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Key Processes ({module.processes?.length || 0})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <List dense>
                        {module.processes?.map((process, processIndex) => (
                          <ListItem key={processIndex} sx={{ py: 1, px: 2 }}>
                            <ListItemText 
                              primary={process}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  fontSize: '0.9rem',
                                  lineHeight: 1.6
                                } 
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderStakeholdersContent = () => {
    if (!sowData?.business_units || sowData.business_units.length === 0) return null;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Business Units
        </Typography>
        
        {sowData.business_units.map((unit, index) => (
          <Accordion key={index} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {unit.business_unit_name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Designation</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unit.stakeholders?.map((stakeholder, stakeholderIndex) => (
                      <TableRow key={stakeholderIndex}>
                        <TableCell>{stakeholder.name}</TableCell>
                        <TableCell>{stakeholder.designation}</TableCell>
                        <TableCell>{stakeholder.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    );
  };

  const renderLicensesContent = () => {
    if (!sowData?.salesforce_licenses_extracted || sowData.salesforce_licenses_extracted.length === 0) return null;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Salesforce Licenses
        </Typography>
        
        <Grid container spacing={2}>
          {sowData.salesforce_licenses_extracted.map((license, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {license.license_type}
                  </Typography>
                  <Chip 
                    label={`Count: ${license.count}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderAssumptionsContent = () => {
    if (!sowData?.assumptions || sowData.assumptions.length === 0) return null;

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Assumptions
        </Typography>
        
        <Card>
          <CardContent>
            <List>
              {sowData.assumptions.map((assumption, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemText 
                    primary={`${index + 1}. ${assumption}`}
                    sx={{ 
                      '& .MuiListItemText-primary': { 
                        fontSize: '0.95rem',
                        lineHeight: 1.6
                      } 
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'scope':
        return renderScopeContent();
      case 'modules':
        return renderModulesContent();
      case 'stakeholders':
        return renderStakeholdersContent();
      case 'licenses':
        return renderLicensesContent();
      case 'assumptions':
        return renderAssumptionsContent();
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back to Workspaces
        </Button>
      </Box>
    );
  }

  if (!sowData) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No SOW data found for this workspace
        </Alert>
        <Button onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back to Workspaces
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      <Paper 
        elevation={1} 
        sx={{ 
          width: 300, 
          minHeight: '100vh',
          borderRadius: 0,
          borderRight: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ p: 2 }}>
          <Button 
            onClick={handleBack} 
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Workspaces
          </Button>
          
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Statement of Work
          </Typography>
          
          <List>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedSection === 'scope'}
                onClick={() => setSelectedSection('scope')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemText primary="Scope" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedSection === 'modules'}
                onClick={() => setSelectedSection('modules')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemText primary="Modules" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedSection === 'stakeholders'}
                onClick={() => setSelectedSection('stakeholders')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemText primary="Business Units" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedSection === 'licenses'}
                onClick={() => setSelectedSection('licenses')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemText primary="License List" />
              </ListItemButton>
            </ListItem>
            
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedSection === 'assumptions'}
                onClick={() => setSelectedSection('assumptions')}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }
                }}
              >
                <ListItemText primary="Assumptions" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Paper>

      {/* Right Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ p: 3 }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default SOWPage;
