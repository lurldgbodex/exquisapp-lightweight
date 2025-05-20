import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import WalletPage from "./pages/WalletPage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage />},
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'Dashboard', element: <DashboardPage /> },
          { path: 'wallet', element: <WalletPage /> },
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
