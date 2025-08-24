import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const AdminDashboard = () => {
  const handleConnect = () => {
    // Redirigir al endpoint del backend que inicia el flujo OAuth
    // Construir la URL base de la API desde las variables de entorno
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    // La URL de inicio de OAuth
    window.location.href = `${apiUrl}/integrations/whatsapp/initiate`;
  };

  return (
    <Box>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography>Manage users and settings.</Typography>
      <Button variant="contained" onClick={handleConnect} sx={{ mt: 2 }}>
        Connect WhatsApp Account
      </Button>
    </Box>
  );
};

export default AdminDashboard;
