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
        <div className="auth-container">
            <div className="auth-card">
                <h2 style={{textAlign: 'center', color: '#2c3e50'}}>Organization Register</h2>
                <form onSubmit={handleRegister}>
                    <input className="form-control" type="text" placeholder="Organization Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="form-control" type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <input className="form-control" type="email" placeholder="Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                    <input className="form-control" type="text" placeholder="Phone Number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                    <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="btn btn-block" type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;