import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import UserModal from './UserModal';
import '../assets/styles/navbar.css';

const Navbar = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const navigate = useNavigate();

    const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);

    const handleCategoryClick = (category) => {
        navigate(`/category/${category}`);
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo" onClick={() => navigate('/')}>TEAM10</div> {/* Navigate to home on click */}
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
                    <FaShoppingBag className="icon" />
                </div>
            </div>
            {isUserModalOpen && <UserModal onClose={toggleUserModal} />}
        </nav>
    );
};

export default Navbar;
