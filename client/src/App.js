import React from "react";
import { BrowserRouter, Route, Routes,Link } from "react-router-dom";
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import EmployeeRegisterPage from './EmployeeRegisterPage';
import DashboardPage from "./Dashboard";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from './ProtectedRoute';
import NewRequestPage from "./NewRequestPage";
import AdminRequestsPage from './AdminRequestsPage';
import ScheduledCollectionsPage from './ScheduledCollectionsPage';
import MyBillingPage from './MyBillingPage';
import ManageVehiclesPage from './ManageVehiclesPage';
import ManageEmployeesPage from './ManageEmployeesPage';
import DriverDashboardPage from './DriverDashboardPage';

function App() {
   return (
    <AuthProvider>
      <BrowserRouter>
    
        <nav style={{ padding: '10px', background: '#eee' }}>
          <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register" style={{ marginRight: '10px' }}>Register</Link>
          <Link to="/employee-register">Employee Registration</Link>
        </nav>
    
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<h2>Home Page</h2>} />
          <Route path="/employee-register" element={<EmployeeRegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/new-request" element={<NewRequestPage />}/>
            <Route path="/my-billing" element={<MyBillingPage />} />
            <Route path="/admin/requests" element={<AdminRequestsPage />} />
            <Route path="/admin/scheduled" element={<ScheduledCollectionsPage />} />
            <Route path="/admin/vehicles" element={<ManageVehiclesPage />} />
            <Route path="/admin/employees" element={<ManageEmployeesPage />} />
            <Route path="/driver-dashboard" element={<DriverDashboardPage />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </AuthProvider>
   );
}

export default App;
