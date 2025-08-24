import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3">403 - Unauthorized</Typography>
      <Typography variant="body1">You do not have permission to access this page.</Typography>
      <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
        Go to Homepage
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;
