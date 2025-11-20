import React from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import './App.css'; // Import the CSS

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

const LandingPage = () => (
  <div className="landing-container">
    <div className="landing-card">
      <h1 className="landing-title">The Waste Manifest</h1>
      <p className="landing-subtitle">Integrated Waste Logistics System</p>
      <div className="btn-group">
        <Link to="/login" className="btn">Login to Portal</Link>
        <Link to="/register" className="btn btn-secondary">Register Organization</Link>
      </div>
    </div>
  </div>
);

function App() {
   return (
    <AuthProvider>
      <BrowserRouter>
    
        {/* Professional Header */}
        <nav className="navbar">
          <Link to="/" className="navbar-brand">The Waste Manifest</Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/employee-register">Admin Access</Link>
          </div>
        </nav>
    
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/employee-register" element={<EmployeeRegisterPage />} />
    
          {/* Protected Routes */}
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