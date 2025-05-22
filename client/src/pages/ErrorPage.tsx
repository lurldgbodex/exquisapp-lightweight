import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Alert, Stack } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { logout } = useAuth();

  let errorMessage = 'An unexpected error occurred';
  let status = 0;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReload = () => window.location.reload();

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        {status ? `${status} Error` : 'Application Error'}
      </Typography>
      
      <Alert severity="error" sx={{ mb: 3 }}>
        {errorMessage}
      </Alert>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleReload}>
          Reload Page
        </Button>
        {status === 401 && (
          <Button variant="outlined" onClick={handleLogout}>
            Log In Again
          </Button>
        )}
      </Stack>
    </Container>
  );
}