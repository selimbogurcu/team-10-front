import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/productList.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductList = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 20;

    const products = Array.from({ length: 62 }, (_, index) => ({
        id: index + 1,
        name: `Product ${index + 1}`,
        price: `$${100 + (index * 10)}`,
        image: 'https://via.placeholder.com/150',
        discount: index % 5 === 0 ? 10 + (index % 3) * 5 : null,
    }));

    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + productsPerPage);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleProductClick = (id) => {
        navigate(`/product/${id}`);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Navbar />
            <div className="product-page">
                {/* Sidebar Filters */}
                <aside className="sidebar">
                    <h3>Keywords</h3>
                    <div className="tags">
                        <button>Spring</button>
                        <button>Smart</button>
                        <button>Modern</button>
                    </div>

                    <h3>Label</h3>
                    <div className="filter-options">
                        <label><input type="checkbox" /> Label 1</label>
                        <label><input type="checkbox" /> Label 2</label>
                        <label><input type="checkbox" /> Label 3</label>
                    </div>

                    <h3>Price</h3>
                    <input type="range" min="0" max="100" />

                    <h3>Color</h3>
                    <div className="filter-options">
                        <label><input type="checkbox" /> Black</label>
                        <label><input type="checkbox" /> White</label>
                        <label><input type="checkbox" /> Red</label>
                    </div>

                    <h3>Size</h3>
                    <div className="filter-options">
                        <label><input type="checkbox" /> Small</label>
                        <label><input type="checkbox" /> Medium</label>
                        <label><input type="checkbox" /> Large</label>
                    </div>
                </aside>

                {/* Main Content - Product List */}
                <main className="product-list-container">
                    <div className="sort-options">
                        <button className="active">New</button>
                        <button>Price ascending</button>
                        <button>Price descending</button>
                        <button>Rating</button>
                    </div>

                    <div className="product-grid">
                        {currentProducts.map((product) => (
                            <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
                                <img src={product.image} alt={product.name} className="product-image" />
                                <h3>{product.name}</h3>
                                <p className="product-price">{product.price}</p>
                                {product.discount && <span className="discount-tag">{product.discount}% OFF</span>}
                                <button onClick={() => handleProductClick(product.id)}>View Details</button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default ProductList;
