import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/userProfile.css';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});

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
    }, [token, user, navigate]);

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

    const fetchOrderDetails = async (orderId) => {
        try {
            if (orderDetails[orderId]) {
                setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
                return;
            }

            const response = await fetch(`http://localhost:1337/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch order details');
            }

            const data = await response.json();
            setOrderDetails((prev) => ({ ...prev, [orderId]: data }));
            setExpandedOrderId(orderId);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleRefundRequest = async (orderId, productId) => {
        try {
            const response = await fetch(`http://localhost:1337/api/orders/refund/request`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.userIdNumber,
                    order_id: orderId,
                    products: [{ product_id: productId, quantity: 1 }],
                }),
            });

            if (!response.ok) {
                throw new Error('Refund request failed');
            }

            const data = await response.json();
            alert(`Refund request successful for Product ID: ${productId}. Refund ID: ${data.results[0].refundId}`);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleLogout = () => {
        logout();
        console.log("User logged out");
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
                        <ul className="order-list">
                            {userOrders.map((order) => (
                                <li key={order.order_id} className="order-item">
                                    <div className="order-item-header">
                                        <p className="order-id">Order ID: {order.order_id}</p>
                                        <span
                                            className={`order-status ${
                                                order.status === 'processing'
                                                    ? 'status-processing'
                                                    : order.status === 'completed'
                                                    ? 'status-completed'
                                                    : 'status-cancelled'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="order-item-detail">
                                        <p><strong>Total Price:</strong> ${parseFloat(order.total_price).toFixed(2)}</p>
                                        <p><strong>Delivery Address:</strong> {order.delivery_address || "Not provided"}</p>
                                        <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <button
                                        className="view-order-details-button"
                                        onClick={() => fetchOrderDetails(order.order_id)}
                                    >
                                        {expandedOrderId === order.order_id ? "Hide Details" : "View Order Details"}
                                    </button>
                                    {expandedOrderId === order.order_id && orderDetails[order.order_id] && (
                                        <div className="order-details">
                                            <h3>Order Details</h3>
                                            <ul>
                                                {orderDetails[order.order_id].items.map((item) => (
                                                    <li key={item.product_id}>
                                                        {item.product_name} - Quantity: {item.quantity}, Price: ${parseFloat(item.price).toFixed(2)}
                                                        <button
                                                            className="refund-button"
                                                            onClick={() =>
                                                                handleRefundRequest(order.order_id, item.product_id)
                                                            }
                                                        >
                                                            Request Refund
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
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
