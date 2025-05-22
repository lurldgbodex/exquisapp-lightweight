import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          MoneyPal Payments
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Send and receive money securely
        </Typography>
        
        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Log In
          </Button>
          <Button
            component={Link}
            to="/register"
            variant="outlined"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}