import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import UserModal from './UserModal';
import { useAuth } from '../contexts/AuthContexts'; // AuthContext'i içe aktarın
import { useCart } from '../contexts/CartContexts'; // CartContext'i içe aktarın
import '../assets/styles/navbar.css';

const Navbar = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const cartDropdownRef = useRef(null);
    const { token, user } = useAuth();
    const { cart } = useCart(); // CartContext'ten cart bilgisini alın

    const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);
    const toggleCartDropdown = () => setIsCartDropdownOpen(!isCartDropdownOpen);

    const handleUserIconClick = () => {
        if (token) {
            navigate('/profile'); // Token varsa profil sayfasına yönlendir
        } else {
            toggleUserModal(); // Token yoksa modal aç
        }
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.count, 0).toFixed(2);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo" onClick={() => navigate('/')}>TEAM10</div>
                <ul className="nav-links">
                    <li onClick={() => navigate('/category/MobilePhone')}>Mobile Phone</li>
                    <li onClick={() => navigate('/category/Television')}>Television</li>
                    <li onClick={() => navigate('/category/Notebook')}>Notebook</li>
                    <li onClick={() => navigate('/category/Tablets')}>Tablets</li>
                </ul>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                    />
                </div>
                <div className="nav-icons">
                    <FaUser className="icon" onClick={handleUserIconClick} />
                    {user && <span className="username">{user.name}</span>} {/* Kullanıcı adı */}
                    <FaHeart className="icon" />
                    <FaShoppingBag className="icon" onClick={toggleCartDropdown} />
                </div>
            </div>
            {isUserModalOpen && <UserModal onClose={toggleUserModal} />}
            {isCartDropdownOpen && (
                <div className="cart-dropdown" ref={cartDropdownRef}>
                    <h3>Cart</h3>
                    {cart.length > 0 ? (
                        <div>
                            <ul className="cart-items">
                                {cart.map((item) => (
                                    <li key={item.id} className="cart-item">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-count">{item.count}x</span>
                                        <span className="item-price">{(item.price * item.count).toFixed(2)}₺</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="cart-total">
                                <strong>Total:</strong> ₺{calculateTotalPrice()}
                            </div>
                            <div className="cart-actions">
                                <button onClick={() => navigate('/cart')} className="view-cart-link">
                                    Go To Cart
                                </button>
                                <button 
                                    onClick={() => {
                                        if (token) {
                                            navigate('/checkout'); // Valid token, navigate to payment
                                        } else {
                                            toggleUserModal(); // No valid token, open the login modal
                                        }
                                    }} 
                                    className="checkout-button">
                                    {token ? 'Go Payment' : 'Login to Pay'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                    <span className="close-dropdown" onClick={toggleCartDropdown}>×</span>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
