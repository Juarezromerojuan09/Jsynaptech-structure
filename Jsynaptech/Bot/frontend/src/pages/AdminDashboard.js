import React from 'react';
import { Typography, Box, Button } from '@mui/material';

const AdminDashboard = () => {
  const handleConnect = () => {
    // Redirigir al endpoint del backend que inicia el flujo OAuth
    // Construir la URL base de la API desde las variables de entorno
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    const token = localStorage.getItem('token');

    if (!token) {
      // Opcional: manejar el caso en que no haya token
      alert('Authentication error. Please log in again.');
      return;
    }

    // Añadir el token como query param para que el backend pueda autenticar esta redirección
    window.location.href = `${apiUrl}/integrations/whatsapp/initiate?token=${token}`;
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
