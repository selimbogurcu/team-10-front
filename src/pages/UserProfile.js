import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../assets/styles/userProfile.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductList = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            <div className="user-profile-page">
                
            </div>
            <Footer />
        </div>
    );
};

export default ProductList;
