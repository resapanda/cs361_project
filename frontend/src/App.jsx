import React from 'react';
import { Routes, Route, useLocation} from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import Health from './pages/Health';
import AddProfile from './pages/AddProfile';
import AddHealth from './pages/AddHealth';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Define the backend port and URL for API requests
const backendPort = 9971;
const backendURL = `http://127.0.0.1:${backendPort}`;

function App() {
    const location = useLocation();
    const isWelcomePage = location.pathname === "/";

    return (
        <> 
            {/* Hide title and nav before user login */}
            {!isWelcomePage &&
                <div className="home-banner">
                    <h1 className="header-title">Pet Daily Care</h1>
                </div>
            }
            {!isWelcomePage && <Navigation />}
                <Routes>
                    <Route className="nav-item" path="/" element={<Welcome backendURL={backendURL} />} />
                    <Route className="nav-item" path="/home" element={<ProtectedRoute><Home backendURL={backendURL}/></ProtectedRoute>} />
                    <Route className="nav-item" path="/profile" element={<ProtectedRoute><Profile backendURL={backendURL} /></ProtectedRoute>} />
                    <Route className="nav-item" path="/add-profile" element={<ProtectedRoute><AddProfile backendURL={backendURL} /></ProtectedRoute>} />
                    <Route className="nav-item" path="/health" element={<ProtectedRoute><Health backendURL={backendURL} /></ProtectedRoute>} />
                    <Route className="nav-item" path="/add-health" element={<ProtectedRoute><AddHealth backendURL={backendURL} /></ProtectedRoute>} />
                </Routes>

            <footer>
                <p>&copy; 2026 Pet Daily Care</p>
            </footer>
        </>
    );

} export default App;
