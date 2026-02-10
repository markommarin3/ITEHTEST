import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    if (!user) {
        // Redirekcija na login ako korisnik nije ulogovan
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.uloga.toUpperCase())) {
        // Redirekcija na home ako korisnik nema dozvoljenu ulogu
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
