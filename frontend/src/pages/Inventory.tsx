import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DataGrid, GridColDef, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid';
import { differenceInDays } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';

interface Medication {
  id: number;
  name: string;
  description: string;
  quantity: number;
  expirationDate: Date;
  donor: string;
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Nombre', width: 200 },
  { field: 'description', headerName: 'Descripción', width: 300 },
  { field: 'quantity', headerName: 'Cantidad', width: 130 },
  {
    field: 'expirationDate',
    headerName: 'Fecha de Vencimiento',
    width: 200,
    valueFormatter: (params: GridValueFormatterParams) => {
      return new Date(params.value).toLocaleDateString('es-ES');
    },
  },
  { field: 'donor', headerName: 'Donante', width: 200 },
  {
    field: 'status',
    headerName: 'Estado',
    width: 150,
    renderCell: (params: GridRenderCellParams) => {
      const medication = params.row as Medication;
      const daysUntilExpiration = differenceInDays(
        new Date(medication.expirationDate),
        new Date()
      );

      if (daysUntilExpiration < 0) {
        return <Alert severity="error">Vencido</Alert>;
      } else if (daysUntilExpiration <= 30) {
        return <Alert severity="warning">Próximo a vencer</Alert>;
      } else {
        return <Alert severity="success">Vigente</Alert>;
      }
    },
  },
];

const Inventory: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [open, setOpen] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewMedication({});
  };

  const handleSubmit = () => {
    if (newMedication.name && newMedication.quantity && newMedication.expirationDate) {
      const medication: Medication = {
        id: medications.length + 1,
        name: newMedication.name,
        description: newMedication.description || '',
        quantity: Number(newMedication.quantity),
        expirationDate: new Date(newMedication.expirationDate),
        donor: newMedication.donor || 'Anónimo',
      };
      setMedications([...medications, medication]);
      handleClose();
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Inventario de Medicamentos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Agregar Medicamento
        </Button>
      </Box>

      <DataGrid
        rows={medications}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10]}
        autoHeight
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nuevo Medicamento</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nombre"
              fullWidth
              value={newMedication.name || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewMedication({ ...newMedication, name: e.target.value })
              }
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={2}
              value={newMedication.description || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewMedication({ ...newMedication, description: e.target.value })
              }
            />
            <TextField
              label="Cantidad"
              type="number"
              fullWidth
              value={newMedication.quantity || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewMedication({ ...newMedication, quantity: e.target.value })
              }
            />
            <DatePicker
              label="Fecha de Vencimiento"
              value={newMedication.expirationDate}
              onChange={(date) =>
                setNewMedication({ ...newMedication, expirationDate: date })
              }
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField
              label="Donante"
              fullWidth
              value={newMedication.donor || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewMedication({ ...newMedication, donor: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory; 