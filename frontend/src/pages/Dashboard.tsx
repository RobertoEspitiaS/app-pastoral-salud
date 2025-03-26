import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  Medication as MedicationIcon,
  Warning as WarningIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // This would come from the backend
  const stats = {
    totalMedications: 150,
    expiringMedications: 5,
    totalConsultations: 25,
  };

  const expiringMedications = [
    { name: 'Paracetamol', quantity: 10, daysUntilExpiration: 5 },
    { name: 'Ibuprofeno', quantity: 15, daysUntilExpiration: 15 },
    { name: 'Amoxicilina', quantity: 8, daysUntilExpiration: 20 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Panel de Control
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
            }}
          >
            <MedicationIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalMedications}</Typography>
            <Typography color="text.secondary">Total Medicamentos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
            }}
          >
            <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h4">{stats.expiringMedications}</Typography>
            <Typography color="text.secondary">Medicamentos por Vencer</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              height: 140,
            }}
          >
            <PeopleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h4">{stats.totalConsultations}</Typography>
            <Typography color="text.secondary">Consultas Totales</Typography>
          </Paper>
        </Grid>

        {/* Expiring Medications List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Medicamentos por Vencer
            </Typography>
            <List>
              {expiringMedications.map((medication) => (
                <ListItem key={medication.name}>
                  <ListItemText
                    primary={medication.name}
                    secondary={`${medication.quantity} unidades - Vence en ${medication.daysUntilExpiration} días`}
                  />
                  <Alert
                    severity={
                      medication.daysUntilExpiration <= 7
                        ? 'error'
                        : medication.daysUntilExpiration <= 30
                        ? 'warning'
                        : 'info'
                    }
                    sx={{ ml: 2 }}
                  >
                    {medication.daysUntilExpiration <= 7
                      ? 'Vence pronto'
                      : medication.daysUntilExpiration <= 30
                      ? 'Próximo a vencer'
                      : 'Vigente'}
                  </Alert>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Actividad Reciente
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Nueva consulta médica"
                  secondary="Juan Pérez - 2 horas atrás"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Medicamento agregado al inventario"
                  secondary="Paracetamol - 5 horas atrás"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Receta médica impresa"
                  secondary="María García - 1 día atrás"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Medicamento por vencer alertado"
                  secondary="Ibuprofeno - 2 días atrás"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 