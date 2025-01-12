import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/userProfile.css';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {    //tokenlerin ayarlanması
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.userIdNumber) {
            setError("User is not authenticated");
            setLoadingUser(false);
            navigate('/');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/users/${user.userIdNumber}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, [token, user, navigate]); //tokeni çağırdığın nokta

    useEffect(() => {
        if (!user || !user.userIdNumber) {
            setError("User is not authenticated");
            setLoadingOrders(false);
            return;
        }

        const fetchUserOrders = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/orders/user_id/${user.userIdNumber}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user orders');
                }

                const data = await response.json();
                setUserOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingOrders(false);
            }
        };

        fetchUserOrders();
    }, [token, user]);

    const handleLogout = () => {
        logout();
        console.log("User logged out");  //çıkış pop up ı
        navigate('/'); 
    };

    if (loadingUser || loadingOrders) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="user-profile-page">
            <Navbar />
            <div className="user-profile-container">
                <h1 className="profile-title">My Profile</h1>
                <div className="profile-details">
                    <h2>Personal Information</h2>
                    <p><strong>Name:</strong> {userData?.name || "Not available"}</p>
                    <p><strong>Email:</strong> {userData?.email || "Not available"}</p>
                    <p><strong>Phone:</strong> {userData?.phone || "Not provided"}</p>
                    <p><strong>Address:</strong> {userData?.address || "Not provided"}</p>
                </div>
                <div className="order-history">
                    <h2>Order History</h2>
                    {userOrders.length > 0 ? (
                        <ul>
                            {userOrders.map((order) => (
                                <li key={order.order_id}>
                                    <p><strong>Order ID:</strong> {order.order_id}</p>
                                    <p><strong>Total Price:</strong> ${parseFloat(order.total_price).toFixed(2)}</p>
                                    <p><strong>Delivery Address:</strong> {order.delivery_address || "Not provided"}</p>
                                    <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {order.status || "Pending"}</p>
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No orders found.</p>
                    )}
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <Footer />
        </div>
    );
};




export default UserProfile;
