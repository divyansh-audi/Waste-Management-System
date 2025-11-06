import React from "react";
import {useAuth} from "./AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardPage(){
    const {setAuthToken}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        setAuthToken(null);
        navigate("/login");
    };

    return(
        <div>
            <h2>Welcome to your Dashboard</h2>
            <p>You can only see this if you are logged in.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default DashboardPage;