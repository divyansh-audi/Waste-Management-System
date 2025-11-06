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

    // Call the new employee endpoint
    axios.post('http://localhost:5000/api/auth/register-admin', {
      name,
      email,
      contact,
      age,
      password,
      adminSecret
    })
      .then(response => {
        console.log("Employee Registration Successful:", response.data.message);
        navigate('/login');
      })
      .catch(err => {
        console.error("Registration Failed:", err.response.data.message);
      });
  };
  return (
    <form onSubmit={handleRegister}>
      <h2>Employee (Admin) Registration</h2>
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
      <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="Admin Secret Key" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} />
      <button type="submit">Register Employee</button>
    </form>
  );
}

export default EmployeeRegisterPage;