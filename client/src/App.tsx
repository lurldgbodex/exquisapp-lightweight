import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/features/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/features/DashboardPage";
import WalletPage from "./pages/features/WalletPage";
import TransactionPage from "./pages/features/TransactionPage";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage />},
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'Dashboard', element: <DashboardPage /> },
          { path: 'wallet', element: <WalletPage /> },
          { path: '/transactions', element: <TransactionPage />}
        ]
      }
    ]
  }
])

function App() {

  return (
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
  )
}

export default App;
