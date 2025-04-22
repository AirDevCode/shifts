import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface Zone {
  id: number;
  name: string;
  description: string;
}

const ZoneManagement = () => {
  const [zones, setZones] = useState<Zone[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Mock data fetching
    const mockZones: Zone[] = [
      { id: 1, name: 'Zone A', description: 'Description for Zone A' },
      { id: 2, name: 'Zone B', description: 'Description for Zone B' },
    ];
    setZones(mockZones);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
    setSelectedZone(null);
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddZone = () => {
    const newZone: Zone = {
      id: zones.length > 0 ? Math.max(...zones.map(z => z.id)) + 1 : 1,
      name: name,
      description: description,
    };
    setZones([...zones, newZone]);
    handleClose();
  };

  const editZone = (id: number) => {
    const zoneToEdit = zones.find(zone => zone.id === id);
    if (zoneToEdit) {
      setOpen(true);
      setSelectedZone(zoneToEdit);
      setName(zoneToEdit.name);
      setDescription(zoneToEdit.description);
    }
  };

  const handleUpdateZone = () => {
    if (selectedZone) {
      const updatedZones = zones.map(zone =>
        zone.id === selectedZone.id ? { ...zone, name: name, description: description } : zone
      );
      setZones(updatedZones);
      handleClose();
    }
  };

  const deleteZone = (id: number) => {
    const updatedZones = zones.filter(zone => zone.id !== id);
    setZones(updatedZones);
  };

  const handleDeleteZone = (id: string) => {
    // Cast id to number before passing to the function expecting number
    deleteZone(Number(id));
  };

  const handleEditZone = (id: string) => {
    // Cast id to number before passing
    editZone(Number(id));
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Zone
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {zones.map((zone) => (
              <TableRow
                key={zone.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {zone.id}
                </TableCell>
                <TableCell>{zone.name}</TableCell>
                <TableCell>{zone.description}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit" onClick={() => handleEditZone(String(zone.id))}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDeleteZone(String(zone.id))}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedZone ? 'Edit Zone' : 'Add Zone'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Zone Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {selectedZone ? (
            <Button onClick={handleUpdateZone}>Update</Button>
          ) : (
            <Button onClick={handleAddZone}>Add</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ZoneManagement;
