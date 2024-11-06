import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/productDetail.css';

import img1 from '../assets/images/exampleProduct1.jpeg';
import img2 from '../assets/images/exampleProduct2.jpeg';

const ProductDetail = () => {
    const { id } = useParams();

    // Sample product data based on your database structure
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

    const { name, model, serial_number, description, quantity_in_stock, price, warranty_status, distributor_info, category, images, created_at } = sampleProduct;
    const [currentImage, setCurrentImage] = useState(images[0]);

    const handleMouseEnter = () => {
        if (images.length > 1) {
            setCurrentImage(images[1]);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImage(images[0]);
    };

    return (
        <div className="product-detail-page">
            <Navbar />
            <div className="product-detail">
                <div
                    className="product-image-section"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img src={currentImage} alt={name} className="product-image" />
                </div>
                <div className="product-info-section">
                    <h1 className="product-name">{name}</h1>
                    <p className="product-model">Model: {model}</p>
                    <p className="product-serial-number">Serial Number: {serial_number}</p>
                    <p className="product-price">${price.toFixed(2)}</p>
                    <p className="product-description">{description}</p>
                    <p className="product-stock">Quantity in Stock: {quantity_in_stock}</p>
                    <p className="product-warranty">
                        Warranty Status: {warranty_status ? 'Yes' : 'No'}
                    </p>
                    <p className="product-distributor">Distributor: {distributor_info}</p>
                    <p className="product-category">Category: {category}</p>
                    <p className="product-created-at">Listed on: {new Date(created_at).toLocaleDateString()}</p>
                    <button className="add-to-cart-button">Add to Cart</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
