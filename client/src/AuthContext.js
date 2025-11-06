import React,{useState,createContext,useContext,useEffect} from "react";   
import { jwtDecode } from 'jwt-decode';
const AuthContext=createContext();
export const useAuth=()=>useContext(AuthContext);
const storedToken=localStorage.getItem('token');

export const AuthProvider=({children})=>{
    const [authToken,setAuthToken]=useState(storedToken);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (authToken) {
          try {
            const decodedToken = jwtDecode(authToken);
            setUser(decodedToken); 
          } catch (error) {
            console.error("Invalid token", error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
    }, [authToken]);

    const setToken=(newToken)=>{
        if(newToken){
            localStorage.setItem('token',newToken);
        }else{
            localStorage.removeItem('token');
        }
        setAuthToken(newToken);
    }

    const value={authToken, setAuthToken:setToken,user:user};

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}