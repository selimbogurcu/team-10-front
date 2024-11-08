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

    const sampleReviews = [
        {
            title: 'Great Quality!',
            body: 'The fabric and design are amazing. Worth every penny!',
            reviewer: 'John Doe',
            date: '2024-11-05',
            rating: 5
        },
        {
            title: 'Good Value',
            body: 'Decent quality for the price. Would recommend to others.',
            reviewer: 'Jane Smith',
            date: '2024-11-04',
            rating: 4
        },
        {
            title: 'Not Bad',
            body: 'It’s good but expected a bit more quality for the price.',
            reviewer: 'Alex Brown',
            date: '2024-11-03',
            rating: 3
        }
    ];

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
                <div
                    className="product-image-section"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img src={currentImage} alt={sampleProduct.name} className="product-image" />
                </div>
                <div className="product-info-section">
                    <h1 className="product-name">{sampleProduct.name}</h1>
                    <p className="product-model">Model: {sampleProduct.model}</p>
                    <p className="product-serial-number">Serial Number: {sampleProduct.serial_number}</p>
                    <p className="product-price">${sampleProduct.price.toFixed(2)}</p>
                    <p className="product-description">{sampleProduct.description}</p>
                    <p className="product-stock">Quantity in Stock: {sampleProduct.quantity_in_stock}</p>
                    <p className="product-warranty">
                        Warranty Status: {sampleProduct.warranty_status ? 'Yes' : 'No'}
                    </p>
                    <p className="product-distributor">Distributor: {sampleProduct.distributor_info}</p>
                    <p className="product-category">Category: {sampleProduct.category}</p>
                    <p className="product-created-at">Listed on: {new Date(sampleProduct.created_at).toLocaleDateString()}</p>
                    <button className="add-to-cart-button">Add to Cart</button>
                </div>
            </div>

            {/* Latest Reviews Section */}
            <div className="latest-reviews">
                <h2>Latest Reviews</h2>
                <div className="reviews-container">
                    {sampleReviews.map((review, index) => (
                        <div key={index} className="review-card">
                            <div className="review-rating">{'⭐'.repeat(review.rating)}</div>
                            <h3 className="review-title">{review.title}</h3>
                            <p className="review-body">{review.body}</p>
                            <p className="reviewer-info">
                                <span className="reviewer-name">{review.reviewer}</span> •{' '}
                                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
