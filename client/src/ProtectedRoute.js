import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate,Outlet } from "react-router-dom";

const ProtectedRoute=()=>{
    const {authToken}=useAuth();
    if(!authToken){
        return <Navigate to ="/login" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoute;