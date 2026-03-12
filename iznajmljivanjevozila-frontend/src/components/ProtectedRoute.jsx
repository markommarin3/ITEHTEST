import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    let user = null;
    try {
        const saved = localStorage.getItem('user');
        user = saved ? JSON.parse(saved) : null;
    } catch (e) {
        console.error('Broke user data:', e);
    }
    const location = useLocation();

    if (!user) {
        // preusmeravanje   na login ako korisnik nije ulogovan
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.uloga?.toUpperCase())) {
        // preusmeravanje na home ako korisnik nema dozvoljenu ulogu
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
