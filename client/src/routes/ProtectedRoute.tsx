import { Navigate, Outlet, useRouteError } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    const error = useRouteError();

    if (error) {
        throw error;
    }

    if (isAuthenticated === undefined) {
        return (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        );
      }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}