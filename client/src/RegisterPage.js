import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage(){
    const [name,setName]=useState("");
    const [address,setAddress]=useState("");
    const [contactEmail,setContactEmail]=useState("");
    const [contactPhone,setContactPhone]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate();

    const handleRegister=(e)=>{
        e.preventDefault();

        axios.post('http://localhost:5000/api/auth/register-org',{
            name,address,contact_email:contactEmail,contact_phone:contactPhone,password
        })
        .then(response=>{
            console.log("Registration Successful:",response.data.message);
            navigate('/login');
        })
        .catch(err=>{
            console.error("Registration Failed:",err.response.data);
        })
    };
    return(
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Organization Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
            />
            <input
                type="text"
                placeholder="Phone Number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
        </form>
    );
}

export default RegisterPage;