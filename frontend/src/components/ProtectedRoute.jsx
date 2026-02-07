import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if a user ID exists in storage
    const isAuthenticated = localStorage.getItem('userId');

    // If not logged in, redirect them back to the Welcome page
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If logged in, let them see the page
    return children;
};
export default ProtectedRoute;