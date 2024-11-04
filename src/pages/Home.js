import React from 'react';
import Navbar from '../components/Navbar';
import CategoryCarousel from '../components/CategoryCarousel';
import Footer from '../components/Footer';
import '../assets/styles/home.css';

import electronicsImg from '../assets/images/electronics.webp';
import clothingImg from '../assets/images/clothing.webp';
import homeLivingImg from '../assets/images/home.webp';
import fashionImg from '../assets/images/fashion.webp';

const Home = () => {
    const categories = [
        { id: 1, title: 'Electronics', description: 'Discover the latest in technology with exclusive offers!', image: electronicsImg },
        { id: 2, title: 'Clothing', description: 'Fresh styles and top brands available now!', image: clothingImg },
        { id: 3, title: 'Home & Living', description: 'Upgrade your home with beautiful decor and essentials.', image: homeLivingImg },
        { id: 4, title: 'Fashion', description: 'Trendy outfits for every occasion. Shop now!', image: fashionImg },
    ];

    const featuredProducts = [
        { id: 1, name: 'Product 1', price: '$200', image: 'product1.jpg', discount: 10 },
        { id: 2, name: 'Product 2', price: '$250', image: 'product2.jpg' },
        { id: 3, name: 'Product 3', price: '$180', image: 'product3.jpg' },
        { id: 4, name: 'Product 4', price: '$300', image: 'product4.jpg', discount: 15 },
        { id: 5, name: 'Product 5', price: '$120', image: 'product5.jpg' },
        { id: 6, name: 'Product 6', price: '$220', image: 'product6.jpg', discount: 20 },
    ];

    return (
        <div className="home">
            <Navbar />
            <header className="banner">
                <CategoryCarousel categories={categories} />
            </header>
            <section className="featured-products">
                <h2>Featured Products</h2>
                <div className="product-grid">
                    {featuredProducts.map((product) => (
                        <div className="product-card" key={product.id}>
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>
                            <button>Buy Now</button>
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Home;
