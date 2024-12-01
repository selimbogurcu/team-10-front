import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/productDetail.css';
import { useCart } from '../contexts/CartContexts'; // CartContext'ten hook
import CartProductDm from '../domain/CartProductDm'; // Modeli içe aktar

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart(); // Sepete ekleme fonksiyonunu kullan

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No product found</div>;
    }

    const handleAddToCart = () => {
        // CartProductDm kullanarak ürün nesnesi oluştur
        const productToAdd = new CartProductDm(
            product.product_id,
            product.name,
            product.price,
            1 // Varsayılan olarak 1 adet eklenir
        );

        addToCart(productToAdd); // Sepete ekle
        alert(`${product.name} added to cart`);
    };

    return (
        <div className="product-detail-page">
            <Navbar />
            <div className="product-detail">
                <div className="product-image-section">
                    {product.photo_url ? (
                        <img
                            src={product.photo_url}
                            alt={product.name}
                            className="product-image"
                        />
                    ) : (
                        <p>No image available</p>
                    )}
                    <div className="favorite-icon">❤</div>
                </div>
                <div className="product-info-section">
                    <h1 className="product-name">{product.name}</h1>
                    <p className="product-model">Model: {product.model}</p>
                    <p className="product-serial-number">Serial Number: {product.serial_number}</p>
                    <p className="product-price">Price: ₺{parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-stock">
                        Quantity in Stock: {product.quantity_in_stock}
                    </p>
                    <p className="product-warranty">
                        Warranty Status: {product.warranty_status ? "Valid" : "Not Valid"}
                    </p>
                    <p className="product-distributor">
                        Distributor: {product.distributor_info}
                    </p>
                    <p className="product-dimensions">
                        Dimensions: {product.sizes?.dimensions || "N/A"}
                    </p>
                    <div className="dropdowns">
                        <div className="dropdown">
                            <label>Size</label>
                            <select>
                                <option value={product.sizes?.dimensions}>
                                    {product.sizes?.dimensions}
                                </option>
                            </select>
                        </div>
                    </div>
                    <button 
                        className="add-to-cart-button" 
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
