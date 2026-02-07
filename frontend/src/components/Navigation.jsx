import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navigation() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/'); 
    };

    return (
        <nav>
            <a href="/home">Home</a>
            <a href="/profile">Profile</a>
            <a href="/health">Health</a>
            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </nav>
    );
}
export default Navigation;