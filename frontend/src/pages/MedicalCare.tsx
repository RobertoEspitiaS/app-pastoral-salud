import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

interface PrescriptionItem {
  id: number;
  medicationId: number;
  medicationName: string;
  dosage: string;
  quantity: number;
  instructions: string;
}

interface Consultation {
  id: number;
  patientName: string;
  date: Date;
  diagnosis: string;
  prescription: PrescriptionItem[];
}

const MedicalCare: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [open, setOpen] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState<Partial<Consultation>>({
    prescription: [],
  });
  const [openPrescription, setOpenPrescription] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState<Partial<PrescriptionItem>>({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setCurrentConsultation({ prescription: [] });
  };

  const handleOpenPrescription = () => setOpenPrescription(true);
  const handleClosePrescription = () => {
    setOpenPrescription(false);
    setCurrentPrescription({});
  };

  const handleSubmitConsultation = () => {
    if (currentConsultation.patientName && currentConsultation.date) {
      const consultation: Consultation = {
        id: consultations.length + 1,
        patientName: currentConsultation.patientName,
        date: new Date(currentConsultation.date),
        diagnosis: currentConsultation.diagnosis || '',
        prescription: currentConsultation.prescription || [],
      };
      setConsultations([...consultations, consultation]);
      handleClose();
    }
  };

  const handleSubmitPrescription = () => {
    if (currentPrescription.medicationName && currentPrescription.quantity) {
      const prescription: PrescriptionItem = {
        id: (currentConsultation.prescription?.length || 0) + 1,
        medicationId: 0, // This would come from the medication inventory
        medicationName: currentPrescription.medicationName,
        dosage: currentPrescription.dosage || '',
        quantity: Number(currentPrescription.quantity),
        instructions: currentPrescription.instructions || '',
      };
      setCurrentConsultation({
        ...currentConsultation,
        prescription: [...(currentConsultation.prescription || []), prescription],
      });
      handleClosePrescription();
    }
  };

  const handleRemovePrescription = (id: number) => {
    setCurrentConsultation({
      ...currentConsultation,
      prescription: currentConsultation.prescription?.filter((item) => item.id !== id),
    });
  };

  const handlePrintPrescription = (consultation: Consultation) => {
    // Implement print functionality
    console.log('Printing prescription for:', consultation);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Atención Médica</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Nueva Consulta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {consultations.map((consultation) => (
          <Grid item xs={12} key={consultation.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Paciente: {consultation.patientName}
                </Typography>
                <Button
                  startIcon={<PrintIcon />}
                  onClick={() => handlePrintPrescription(consultation)}
                >
                  Imprimir Receta
                </Button>
              </Box>
              <Typography>
                Fecha: {new Date(consultation.date).toLocaleDateString('es-ES')}
              </Typography>
              <Typography>Diagnóstico: {consultation.diagnosis}</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicamento</TableCell>
                      <TableCell>Dosis</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Instrucciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consultation.prescription.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.medicationName}</TableCell>
                        <TableCell>{item.dosage}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.instructions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Nueva Consulta Médica</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre del Paciente"
              fullWidth
              value={currentConsultation.patientName || ''}
              onChange={(e) =>
                setCurrentConsultation({
                  ...currentConsultation,
                  patientName: e.target.value,
                })
              }
            />
            <DatePicker
              label="Fecha de Consulta"
              value={currentConsultation.date}
              onChange={(date) =>
                setCurrentConsultation({ ...currentConsultation, date })
              }
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            <TextField
              label="Diagnóstico"
              fullWidth
              multiline
              rows={3}
              value={currentConsultation.diagnosis || ''}
              onChange={(e) =>
                setCurrentConsultation({
                  ...currentConsultation,
                  diagnosis: e.target.value,
                })
              }
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Receta Médica
              </Typography>
              <Button
                variant="outlined"
                onClick={handleOpenPrescription}
                sx={{ mb: 2 }}
              >
                Agregar Medicamento
              </Button>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicamento</TableCell>
                      <TableCell>Dosis</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Instrucciones</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentConsultation.prescription?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.medicationName}</TableCell>
                        <TableCell>{item.dosage}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.instructions}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleRemovePrescription(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmitConsultation} variant="contained">
            Guardar Consulta
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPrescription} onClose={handleClosePrescription}>
        <DialogTitle>Agregar Medicamento a la Receta</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre del Medicamento"
              fullWidth
              value={currentPrescription.medicationName || ''}
              onChange={(e) =>
                setCurrentPrescription({
                  ...currentPrescription,
                  medicationName: e.target.value,
                })
              }
            />
            <TextField
              label="Dosis"
              fullWidth
              value={currentPrescription.dosage || ''}
              onChange={(e) =>
                setCurrentPrescription({
                  ...currentPrescription,
                  dosage: e.target.value,
                })
              }
            />
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              value={currentPrescription.quantity || ''}
              onChange={(e) =>
                setCurrentPrescription({
                  ...currentPrescription,
                  quantity: e.target.value,
                })
              }
            />
            <TextField
              label="Instrucciones"
              fullWidth
              multiline
              rows={2}
              value={currentPrescription.instructions || ''}
              onChange={(e) =>
                setCurrentPrescription({
                  ...currentPrescription,
                  instructions: e.target.value,
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePrescription}>Cancelar</Button>
          <Button onClick={handleSubmitPrescription} variant="contained">
            Agregar a la Receta
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalCare; 