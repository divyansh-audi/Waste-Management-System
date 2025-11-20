import React from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";

function DashboardPage() {
    const { setAuthToken, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuthToken(null);
        navigate("/login");
    };

    if (!user) {
        return <div className="page-container">Loading...</div>;
    }

    // Helper component for dashboard cards
    const DashLink = ({ to, title, desc }) => (
        <Link to={to} style={{textDecoration:'none', color:'inherit'}}>
            <div className="card" style={{height: '100%', transition: 'transform 0.2s', cursor:'pointer'}}>
                <h3 style={{color: '#3498db'}}>{title}</h3>
                <p style={{color: '#7f8c8d'}}>{desc}</p>
            </div>
        </Link>
    );

    return (
        <div className="page-container">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                <h2 style={{margin:0, color: '#2c3e50'}}>Dashboard</h2>
                <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
            </div>

            <p style={{marginBottom: '2rem'}}>Logged in as: <strong>{user.email}</strong> ({user.role})</p>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem'}}>
                
                {/* --- Admin-Only View --- */}
                {user.role === 'admin' && (
                    <>
                        <DashLink to="/admin/requests" title="Pending Requests" desc="View and schedule incoming waste pickup requests." />
                        <DashLink to="/admin/scheduled" title="Scheduled Collections" desc="Track active jobs and mark them as complete." />
                        <DashLink to="/admin/vehicles" title="Manage Vehicles" desc="Add new trucks and vans to your fleet." />
                        <DashLink to="/admin/employees" title="Manage Employees" desc="Register new admins and drivers." />
                    </>
                )}

                {/* --- Organization-Only View --- */}
                {user.role === 'organisation' && (
                    <>
                        <DashLink to="/new-request" title="New Request" desc="Schedule a waste pickup for your location." />
                        <DashLink to="/my-billing" title="Billing History" desc="View past invoices and make payments." />
                    </>
                )}

                {/* --- Driver-Only View --- */}
                {user.role === 'driver' && (
                    <DashLink to="/driver-dashboard" title="My Jobs" desc="View your assigned route and complete jobs." />
                )}
            </div>
        </div>
    );
}

export default DashboardPage;