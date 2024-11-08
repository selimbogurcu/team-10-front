// ProductDetail.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/productDetail.css';
import img1 from '../assets/images/exampleProduct1.jpeg';
import img2 from '../assets/images/exampleProduct2.jpeg';

const ProductDetail = () => {
    const { id } = useParams();

    const sampleProduct = {
        name: 'Uğur Haykır Taraftar Forması',
        model: 'Model UH007',
        serial_number: 'SN123456789',
        description: 'This is a high-quality product suitable for various purposes. Built to last and highly reliable.',
        quantity_in_stock: 25,
        price: 200.00,
        warranty_status: true,
        distributor_info: 'Distributed by Global Distributors Ltd.',
        category: 'Sportswear',
        images: [img1, img2],
        created_at: '2024-11-01'
    };

    const [currentImage, setCurrentImage] = useState(sampleProduct.images[0]);

    const handleMouseEnter = () => {
        if (sampleProduct.images.length > 1) {
            setCurrentImage(sampleProduct.images[1]);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImage(sampleProduct.images[0]);
    };

    return (
        <div className="product-detail-page">
            <Navbar />
            <div className="product-detail">
                <div className="product-image-section" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <img src={currentImage} alt={sampleProduct.name} className="product-image" />
                    <div className="favorite-icon">❤</div>
                </div>
                <div className="product-info-section">
                    <h1 className="product-name">{sampleProduct.name}</h1>
                    <span className="product-tag">New Arrival</span>
                    <p className="product-price">${sampleProduct.price.toFixed(2)}</p>
                    <p className="product-description">{sampleProduct.description}</p>
                    
                    <div className="dropdowns">
                        <div className="dropdown">
                            <label>Label</label>
                            <select>
                                <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                            </select>
                        </div>
                        <div className="dropdown">
                            <label>Label</label>
                            <select>
                                <option>Value 1</option>
                                <option>Value 2</option>
                                <option>Value 3</option>
                            </select>
                        </div>
                    </div>
                    <button className="add-to-cart-button">Add to Cart</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
