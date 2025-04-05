import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Medical Appointment System
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to our medical appointment scheduling system. This is a test deployment.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Frontend is successfully deployed!
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
