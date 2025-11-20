import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/auth/login', { email, password })
            .then(response => {
                setAuthToken(response.data.token);
                navigate("/dashboard");
            })
            .catch(err => {
                console.error(err.response?.data || "Login error");
                alert("Login failed. Check credentials.");
            });
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 style={{textAlign: 'center', color: '#2c3e50'}}>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        className="form-control"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="form-control"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn btn-block" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage;