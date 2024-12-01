import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/userProfile.css';
import { useAuth } from '../contexts/AuthContexts';

const UserProfile = () => {
    const { token, logout } = useAuth(); // AuthContext'ten token ve logout alın

    const user = {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+1 (123) 456-7890",
        address: "123 Main Street, Cityville, Country",
        orders: [
            { id: 1, product: "Product 1", status: "Delivered" },
            { id: 2, product: "Product 2", status: "Processing" },
            { id: 3, product: "Product 3", status: "Cancelled" },
        ],
    };

    const handleLogout = () => {
        console.log("User logged out");
    };

    return (
        <div className="user-profile-page">
            <Navbar />
            <div className="user-profile-container">
                <h1 className="profile-title">My Profile</h1>
                <div className="profile-details">
                    <h2>Personal Information</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Address:</strong> {user.address}</p>
                </div>
                <div className="order-history">
                    <h2>Order History</h2>
                    <ul>
                        {user.orders.map((order) => (
                            <li key={order.id}>
                                <strong>{order.product}</strong> - {order.status}
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;