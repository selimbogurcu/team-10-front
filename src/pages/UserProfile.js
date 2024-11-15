import React from 'react';
import { useAuth } from '../contexts/AuthContexts';

const UserProfile = () => {
    const { token, logout } = useAuth(); // AuthContext'ten token ve logout alın

    return (
        <div>
            <h1>User Profile</h1>
            {token ? (
                <div>
                    <p>Welcome! Your token: {token}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
};

export default UserProfile;
