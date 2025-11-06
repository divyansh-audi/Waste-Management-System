import {useState,} from "react";   
import axios from "axios";
import { useAuth } from "./AuthContext";
import {useNavigate} from "react-router-dom";

function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthToken}=useAuth();
    const navigate=useNavigate();

    const handleLogin=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:5000/api/auth/login',{email,password})
            .then(response=>{
                console.log("login successful ",response.data.token);
                setAuthToken(response.data.token);
                navigate("/dashboard");
            })
            .catch(err=>{
                console.error(err.response.data);
            });
    }

    return(
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginPage;