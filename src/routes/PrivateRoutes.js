// routes/PrivateRoutes.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';

const PrivateRoutes = ({ element, allowedRoles = [] }) => {
    const { token, user } = useAuth();

    // Kullanıcı login değilse anasayfaya gönder
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // allowedRoles doluysa ve kullanıcı rolü bu listede değilse yine anasayfaya gönder
    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    // Hem token hem de role uygunsa route içeriğini döndür
    return element;
};

export default PrivateRoutes;
