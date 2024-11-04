import React, { useState } from 'react';
import '../assets/styles/categoryCarousel.css';

const CategoryCarousel = ({ categories }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
    };

    return (
        <div className="carousel">
            <button className="carousel-btn left-btn" onClick={prevSlide}>&#10094;</button>
            <div className="carousel-content">
                <img src={categories[currentIndex].image} alt={categories[currentIndex].title} className="carousel-image" />
                <div className="carousel-overlay">
                    <h2>{categories[currentIndex].title}</h2>
                    <p>{categories[currentIndex].description}</p>
                    <button className="carousel-button">Shop Now</button>
                </div>
                <div className="carousel-counter">
                    {currentIndex + 1} / {categories.length}
                </div>
            </div>
            <button className="carousel-btn right-btn" onClick={nextSlide}>&#10095;</button>
        </div>
    );
};

export default CategoryCarousel;
