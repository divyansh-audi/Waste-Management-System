import React,{useState,createContext,useContext} from "react";   
const AuthContext=createContext();
export const useAuth=()=>useContext(AuthContext);
const storedToken=localStorage.getItem('token');

export const AuthProvider=({children})=>{
    const [authToken,setAuthToken]=useState(storedToken);

    const setToken=(newToken)=>{
        if(newToken){
            localStorage.setItem('token',newToken);
        }else{
            localStorage.removeItem('token');
        }
        setAuthToken(newToken);
    }

    const value={authToken, setAuthToken:setToken};

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}