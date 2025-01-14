import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContexts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/wishlist.css';

const Wishlist = () => {
    const { user } = useAuth(); // Kullanıcı bilgisi
    const [wishlistItems, setWishlistItems] = useState([]); // Wishlist öğeleri
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Navigation için hook

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                if (!user) throw new Error('You must be logged in to view your wishlist.');
                const response = await fetch(`http://localhost:1337/api/wishlists/user/${user.userIdNumber-16}`);
                if (!response.ok) throw new Error('Failed to fetch wishlist items');

                const data = await response.json();
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('Your wishlist is currently empty.');
                }
                setWishlistItems(data); // Wishlist verisi
            } catch (err) {
                console.error(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [user]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await fetch(`http://localhost:1337/api/wishlists/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user.userId }),
            });
            if (!response.ok) throw new Error('Failed to remove item from wishlist');

            setWishlistItems((prevItems) => prevItems.filter(item => item.product_id !== productId));
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`); // Ürün sayfasına yönlendirme
    };

    return (
        <div className="wishlist-page">
            <Navbar />
            <div className="wishlist-container">
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : wishlistItems.length === 0 ? (
                    <div className="wishlist-empty-container">
                        <h2>Your Wishlist</h2>
                        <p>Your wishlist is empty. Start adding items you love!</p>
                        <img src="/empty-wishlist.svg" alt="Empty Wishlist" className="empty-wishlist-image" />
                    </div>
                ) : (
                    <div>
                        <h1>Your Wishlist</h1>
                        <ul className="wishlist-items">
                            {wishlistItems.map((item) => (
                                <li
                                    key={item.product_id}
                                    className="wishlist-item"
                                    onClick={() => handleProductClick(item.product_id)} // Tıklama eventi
                                    style={{ cursor: 'pointer' }} // Görsel olarak tıklanabilirliği artırmak için
                                >
                                    <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name} className="wishlist-item-image" />
                                    <div className="wishlist-item-details">
                                        <h2>{item.product_name}</h2>
                                        <p>Price: ₺{item.product_price}</p>
                                        {console.log(item.product_price)}
                                        <button
                                            className="remove-button"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Tıklamanın ürün sayfasına yönlendirmesini engeller
                                                handleRemoveFromWishlist(item.product_id);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Wishlist;
