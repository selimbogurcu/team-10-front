import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContexts';

const PrivateRoutes = ({ element }) => {
    const { token } = useAuth();

    if (!token) {
        // Redirect unauthenticated users to the homepage or open login modal
        return <Navigate to="/" replace />;
    }

    // Render the passed component if the user is authenticated
    return element;
};

export default PrivateRoutes;
