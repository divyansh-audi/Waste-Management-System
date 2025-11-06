import React from "react";
import {useAuth} from "./AuthContext";
import { useNavigate,Link } from "react-router-dom";

function DashboardPage(){
    const {setAuthToken,user}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        setAuthToken(null);
        navigate("/login");
    };

    if (!user) {
        return <div>Loading...</div>; 
    }

    return(
         <div>
            {/* This part is for everyone */}
            <h2>Welcome to your Dashboard, {user.email}!</h2>
            <button onClick={handleLogout}>Logout</button>
            <hr />

            {/* --- Admin-Only View --- */}
            {user.role === 'admin' && (
              <div>
                <h3>Admin Panel</h3>
                <Link to="/admin/requests">View Pending Requests</Link>
                <br />
                {/* Add more admin links here later */}
                {/* <Link to="/admin/vehicles">Manage Vehicles</Link> */}
              </div>
            )}

            {/* --- Organization-Only View --- */}
            {user.role === 'organisation' && (
              <div>
                <h3>Organization Portal</h3>
                <Link to="/new-request">Create a New Waste Request</Link>
                <br />
                {/* <Link to="/my-requests">View My Request History</Link> */}
              </div>
            )}
         </div>
    );
}

export default DashboardPage;