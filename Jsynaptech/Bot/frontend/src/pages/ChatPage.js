import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        ¡Hola, {user?.id}!
      </Typography>
      <Typography variant="h5" gutterBottom>
        Conversaciones con el Bot
      </Typography>
      <Typography variant="body1">
        Aquí se mostrarán tus conversaciones con el bot en el futuro.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default ChatPage;