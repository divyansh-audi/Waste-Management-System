import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState(""); 
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/auth/register-admin', {
      name, email, contact, age, password, adminSecret
    })
      .then(response => {
        alert("Employee Registration Successful!");
        navigate('/login');
      })
      .catch(err => {
        console.error("Registration Failed:", err.response?.data);
        alert(err.response?.data?.message || "Registration Failed");
      });
  };

  return (
    <div className="auth-container">
        <div className="auth-card" style={{maxWidth: '500px'}}>
            <h2 style={{textAlign: 'center', color: '#2c3e50'}}>Employee Registration</h2>
            <form onSubmit={handleRegister}>
                <input className="form-control" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="form-control" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input className="form-control" type="text" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
                <input className="form-control" type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                <input className="form-control" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input className="form-control" type="password" placeholder="Admin Secret Key" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} required />
                <button className="btn btn-block" type="submit">Register Employee</button>
            </form>
        </div>
    </div>
  );
}

export default EmployeeRegisterPage;