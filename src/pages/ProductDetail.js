import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../assets/styles/productDetail.css';
import { useAuth } from '../contexts/AuthContexts';
import { useCart } from '../contexts/CartContexts'; // sepetin içeriğini aldığımız nokta

const ProductDetail = () => {
    const { user } = useAuth();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0); // ortalama rating alan kısım
    const [canComment, setCanComment] = useState(false);
    const [wishlistAdded, setWishlistAdded] = useState(false); // Yeni wishlist state'i
    const { addToCart } = useCart(); 

    useEffect(() => {
        const fetchProductAndComments = async () => {
            try {
                // ürünün detaylarını girdiğni kısım
                const productResponse = await fetch(`http://localhost:1337/api/products/${productId}`);
                if (!productResponse.ok) throw new Error('Failed to fetch product details');
                const productData = await productResponse.json();
                setProduct(productData);

                // yazdığın yorumlar ve seçtiğin ratingleri getirme kısmı
                const commentsResponse = await fetch(`http://localhost:1337/api/comments/product/${productId}`);
                if (!commentsResponse.ok) throw new Error('Failed to fetch product comments');
                const commentsData = await commentsResponse.json();
                setComments(commentsData.filter(comment => comment.approved)); 

                
                const ratings = commentsData.map(comment => comment.rating);
                const avgRating = ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 0;
                setAverageRating(avgRating);

                
                if (user) {
                    const purchaseResponse = await fetch(`http://localhost:1337/api/orders/user-products/${user.userIdNumber}`);
                    if (purchaseResponse.ok) {
                        const purchasedProducts = await purchaseResponse.json();
                        const hasPurchased = purchasedProducts.includes(parseInt(productId)); 
                        setCanComment(hasPurchased);
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductAndComments();
    }, [productId, user]);

    const handleAddToCart = () => {
        if (!product || product.quantity_in_stock <= 0) {
            alert('This product is out of stock and cannot be added to the cart.');
            return;
        }
    
        addToCart({
            id: product.product_id,
            name: product.name,
            price: product.price,
            count: 1,
        });
    
        alert(`${product.name} added to the cart!`);
    };


    const handleAddToWishlist = async () => {
        try {
            if (!user) {
                alert('You need to log in to manage your wishlist.');
                return;
            }
    
            if (wishlistAdded) {
                try {
                    // Wishlist'ten çıkar
                    const requestBody = {
                        user_id: user.userIdNumber,
                        product_id: productId,
                    };
            
                    const response = await fetch(`http://localhost:1337/api/wishlists`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestBody),
                    });
            
                    if (!response.ok) {
                        throw new Error('Failed to remove item from wishlist');
                    }
            
                    setWishlistAdded(false);
                    alert(`${product.name} removed from your wishlist.`);
                } catch (error) {
                    console.error('Error:', error.message);
                    alert(`An error occurred: ${error.message}`);
                }
            }
             else {
                // Wishlist'e ekle
                const response = await fetch('http://localhost:1337/api/wishlists/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: user.userIdNumber,
                        product_id: productId,
                    }),
                });
    
                if (!response.ok) throw new Error('Failed to add item to wishlist');
                setWishlistAdded(true);
                alert(`${product.name} added to your wishlist!`);
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    


    const handleAddComment = async () => {
        if (!newComment || newRating === 0) {
            alert('Please provide a comment and a rating');
            return;
        }

        
        const updatedComments = [...comments];
        updatedComments.push({
            user: { name: user.name },
            rating: newRating,
            content: '', 
            approved: false, 
        });
        setComments(updatedComments); //yorum kısımları düzenlenmleme

        try {
            const response = await fetch('http://localhost:1337/api/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.userIdNumber,
                    product_id: productId,
                    content: newComment,
                    rating: newRating,
                }),
            });

            if (!response.ok) throw new Error('Failed to add comment');
            setNewComment('');
            setNewRating(0);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>No product found</div>;
    }

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
                </div>
                <div className="product-info-section">
                    <h1 className="product-name">{product.name}</h1>
                    <p className="product-model">Model: {product.model}</p>
                    <p className="product-serial-number">Serial Number: {product.serial_number}</p>
                    <p className="product-price">Price: ₺{parseFloat(product.price).toFixed(2)}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-stock">Stock: {product.quantity_in_stock}</p>
                    <p className="product-warranty">
                        Warranty: {product.warranty_status ? "Valid" : "Not Valid"}
                    </p>
                    <p className="product-distributor">Distributor: {product.distributor_info}</p>
                    <p className="product-dimensions">Dimensions: {product.sizes?.dimensions || "N/A"}</p>
                    <div className="dropdowns">
                        <label>Size</label>
                        <select>
                            <option value={product.sizes?.dimensions}>
                                {product.sizes?.dimensions}
                            </option>
                        </select>
                    </div>
                    <button 
                        className={`add-to-wishlist-button ${wishlistAdded ? 'added' : ''}`}
                        onClick={handleAddToWishlist}
                    >
                        {wishlistAdded ? ' Remove to Wishlist' : ' Add to Wishlist'}
                    </button>

                    <button 
                        className={`add-to-cart-button ${product.quantity_in_stock <= 0 ? 'disabled' : ''}`} 
                        onClick={handleAddToCart}
                        disabled={product.quantity_in_stock <= 0}  
                    >
                        Add to Cart
                    </button>
                    
                </div>
            </div>
            <div className="comments-section">
                <h2>Comments & Ratings</h2>
                <p className="average-rating">Average Rating: {averageRating} ★</p>
                {comments.map(comment => (
                    <div key={comment.comment_id} className="comment">
                        <p><strong>{comment.user?.name || "Anonymous"}:</strong> {comment.content}</p>
                        <p className="stars">
                            {'★'.repeat(Math.floor(comment.rating)) + 
                            '☆'.repeat(5 - Math.ceil(comment.rating))}
                        </p>
                    </div>
                ))}
                {user ? (
                    canComment ? (
                        <div className="add-comment-section">
                            <textarea
                                placeholder="Write your comment..."
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                            />
                            <select value={newRating} onChange={e => setNewRating(Number(e.target.value))}>
                                <option value={0}>Select Rating</option>
                                <option value={1}>1 Star</option>
                                <option value={2}>2 Stars</option>
                                <option value={3}>3 Stars</option>
                                <option value={4}>4 Stars</option>
                                <option value={5}>5 Stars</option>
                            </select>
                            <button onClick={handleAddComment}>Submit</button>
                        </div>
                    ) : (
                        <p>You need to purchase the product before leaving a comment.</p>
                    )
                ) : (
                    <p>You need to log in to leave a comment.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
