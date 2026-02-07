import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Welcome.css';

const Welcome = ({ backendURL }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/login' : '/register';

        try {
        const response = await fetch(backendURL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            if (isLogin) {
            // Store user ID to satisfy securability requirement
            localStorage.setItem('userId', data.userId);
            navigate('/home');
            } else {
            alert("Registration successful! Please log in.");
            setIsLogin(true);
            }
        } else {
            alert(data.error || "Authentication failed.");
        }
        } catch (error) {
        console.error("Error during auth:", error);
        }
    };

    return (
        <div className="welcome-page">
        <div className="welcome-banner">
            <h1 className="main-title">Pet Daily Care</h1>
        </div>

        <div className="auth-card">
            <h2 className="auth-title">{isLogin ? "Log In" : "Register"}</h2>
            
            <form className="auth-form" onSubmit={handleSubmit}>
            <input 
                type="email" 
                placeholder="Email" 
                className="auth-input"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                className="auth-input"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
            <button type="submit" className="login-btn">
                {isLogin ? "Log In" : "Register"}
            </button>
            </form>

            <p className="toggle-text" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Register here." : "Already have an account? Log in."}
            </p>
        </div>

        {/* Footer quote from prototype */}
        <footer className="welcome-footer">
            <p>tracking pet health information via daily check-ins and vet visit logs 🤍</p>
        </footer>
        </div>
    );
};
export default Welcome;