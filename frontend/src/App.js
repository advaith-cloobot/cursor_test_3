import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import WorkspaceGrid from './components/WorkspaceGrid';
import SOWPage from './components/SOWPage';
import './App.css';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e1e1e',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<WorkspaceGrid />} />
            <Route path="/sow/:workspaceId" element={<SOWPageWrapper />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

// Wrapper component to extract workspaceId from URL params
function SOWPageWrapper() {
  const workspaceId = window.location.pathname.split('/sow/')[1];
  return <SOWPage workspaceId={parseInt(workspaceId)} />;
}

export default App;
