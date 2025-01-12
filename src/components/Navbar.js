import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import UserModal from './UserModal';
import { useAuth } from '../contexts/AuthContexts';
import { useCart } from '../contexts/CartContexts';
import '../assets/styles/navbar.css';

const Navbar = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const navigate = useNavigate();
    const cartDropdownRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const { token, user } = useAuth();
    const { cart } = useCart();

    const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);
    const toggleCartDropdown = () => setIsCartDropdownOpen(!isCartDropdownOpen);

    const handleUserIconClick = () => {
        if (token) {
            navigate('/profile');
        } else {
            toggleUserModal();
        }
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.price * item.count, 0).toFixed(2);
    };

    // API'den arama sonuçlarını al
    const fetchSearchResults = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            setIsSearching(true);
            const response = await fetch(`http://localhost:1337/api/products/search/${query}`);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setSearchResults(data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false); // Arama tamamlandı
        }
    };

    // Debouncing ile arama sorgularını optimize et
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSearchResults(searchTerm);
        }, 500); // Kullanıcı girişinden 500ms sonra API'yi çağır

        return () => clearTimeout(timeoutId); // Önceki timeout'u temizle
    }, [searchTerm]);

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo" onClick={() => navigate('/')}>TEAM10</div>
                <ul className="nav-links">
                    <li onClick={() => navigate('/category/MobilePhone')}>Mobile Phone</li>
                    <li onClick={() => navigate('/category/Notebook')}>Notebook</li>
                    <li onClick={() => navigate('/category/Television')}>Television</li>
                    <li onClick={() => navigate('/category/Tablet')}>Tablet</li>
                </ul>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Kullanıcı girişi
                    />
                    {searchResults.length > 0 && (
                        <div className="search-dropdown" ref={searchDropdownRef}>
                            <ul>
                                {searchResults.map((result) => (
                                    <li
                                        key={result.product_id}
                                        onClick={() => navigate(`/product/${result.product_id}`)}
                                        className="search-result-item"
                                    >
                                        <span className="result-name">{result.name}</span>
                                        <span
                                            className="result-action"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ana tıklama olayını engelle
                                                navigate(`/product/${result.product_id}`);
                                            }}
                                        >
                                            Details
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
                <div className="nav-icons">
                    <FaUser className="icon" onClick={handleUserIconClick} />
                    {user && <span className="username">{user.name}</span>}
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
