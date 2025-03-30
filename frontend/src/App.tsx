import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

// Importar componentes de páginas
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MedicationList from './pages/MedicationList';
import ConsultationList from './pages/ConsultationList';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medications" element={<MedicationList />} />
            <Route path="/consultations" element={<ConsultationList />} />
          </Routes>
        </Layout>
      </Box>
    </ThemeProvider>
  );
}

export default App; 