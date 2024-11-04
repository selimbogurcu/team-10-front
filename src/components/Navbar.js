import React, { useState } from 'react';
import { FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import UserModal from './UserModal';
import '../assets/styles/navbar.css'; 


const Navbar = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const toggleUserModal = () => setIsUserModalOpen(!isUserModalOpen);

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">TEAM10</div>
                <ul className="nav-links">
                    <li>Electronics</li>
                    <li>Home & Living</li>
                    <li>Sports & Outdoors</li>
                    <li>Books</li>
                    <li>Fashion</li>
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
