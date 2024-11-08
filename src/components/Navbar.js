import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import UserModal from './UserModal';
import '../assets/styles/navbar.css';

const Navbar = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const cartDropdownRef = useRef(null);

    const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);
    const toggleCartDropdown = () => setIsCartDropdownOpen(!isCartDropdownOpen);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`);
    };

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
                setIsCartDropdownOpen(false);
            }
        };

        // Add event listener for clicks outside the cart dropdown
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Remove event listener on cleanup
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo" onClick={() => navigate('/')}>TEAM10</div>
                <ul className="nav-links">
                    <li onClick={() => handleCategoryClick('Electronics')}>Electronics</li>
                    <li onClick={() => handleCategoryClick('Home & Living')}>Home & Living</li>
                    <li onClick={() => handleCategoryClick('Sports & Outdoors')}>Sports & Outdoors</li>
                    <li onClick={() => handleCategoryClick('Books')}>Books</li>
                    <li onClick={() => handleCategoryClick('Fashion')}>Fashion</li>
                </ul>
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                    />
                </div>
                <div className="nav-icons">
                    <FaUser className="icon" onClick={toggleUserModal} />
                    <FaHeart className="icon" />
                    <FaShoppingBag className="icon" onClick={toggleCartDropdown} />
                </div>
            </div>
            {isUserModalOpen && <UserModal onClose={toggleUserModal} />}

            {/* Cart Dropdown */}
            {isCartDropdownOpen && (
                <div className="cart-dropdown" ref={cartDropdownRef}>
                    <h3>Cart</h3>
                    <p>Total: <span>$0,00</span></p>
                    <div className="cart-actions">
                        <button onClick={() => navigate('/cart')} className="view-cart-link">Go To Cart</button>
                        <button onClick={() => navigate('/checkout')} className="checkout-button">Go Payment</button>
                    </div>
                    <span className="close-dropdown" onClick={toggleCartDropdown}>×</span>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
