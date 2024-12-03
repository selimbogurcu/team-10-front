import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal'; // PaymentModal bileşenini ekledik
import { useCart } from '../contexts/CartContexts';
import { useAuth } from '../contexts/AuthContexts';

const CheckoutPage = () => {
    const { cart, decreaseQuantity } = useCart(); // decreaseQuantity fonksiyonunu ekledik
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [userInfo, setUserInfo] = useState({
        name: user?.name || '',
        email: '',
        tax_id: '',
        address: '',
    });

    const [isOrderEnabled, setIsOrderEnabled] = useState(false);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    // Modal state
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false); // Modal açık/kapalı kontrolü

    // Modal kontrolü
    const openPaymentModal = () => setPaymentModalOpen(true);
    const closePaymentModal = () => setPaymentModalOpen(false);

    // Fetch user information from the API
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user?.userIdNumber) return;

            try {
                const response = await fetch(`http://localhost:1337/api/users/${user.userIdNumber}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error('Failed to fetch user information.');
                }

                setUserInfo((prevInfo) => ({
                    ...prevInfo,
                    name: data.name,
                    email: data.email || '',
                    tax_id: data.tax_id || '',
                    address: data.address || '',
                }));
            } catch (error) {
                console.error('Error fetching user information:', error);
            }
        };

        fetchUserInfo();
    }, [user?.userIdNumber]);

    // Fetch product details from the API
    useEffect(() => {
        const fetchProducts = async () => {
            const productDetails = await Promise.all(
                cart.map(async (cartItem) => {
                    try {
                        const response = await fetch(`http://localhost:1337/api/products/${cartItem.id}`);
                        const data = await response.json();
                        return { ...data, count: cartItem.count };
                    } catch (error) {
                        console.error(`Error fetching product (ID: ${cartItem.id}):`, error);
                        return null;
                    }
                })
            );

            setProducts(productDetails.filter((item) => item !== null));
        };

        fetchProducts();
    }, [cart]);

    // Check if user information is complete
    useEffect(() => {
        const isFormFilled = userInfo.tax_id.trim() !== '' && userInfo.address.trim() !== '';
        setIsOrderEnabled(isFormFilled);
        setIsSaveEnabled(isFormFilled);
    }, [userInfo]);

    // Update user information
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    // Place order button now opens the Payment Modal
    const handleOrder = () => {
        if (!isOrderEnabled) {
            alert("Please fill all required information.");
            return;
        }

        openPaymentModal(); // Modalı aç
    };

    return (
        <div>
            <Navbar />
            <h1>Checkout Page</h1>
            <p>Review your cart items and enter your information below:</p>

            {/* Product List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <div
                            key={product.product_id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                padding: '10px',
                                gap: '20px',
                            }}
                        >
                            <img
                                src={product.photo_url}
                                alt={product.name}
                                style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                            />
                            <div>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p>
                                    <strong>Price:</strong> {product.price} ₺
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {product.count}
                                </p>
                            </div>
                            <button
                                onClick={() => decreaseQuantity(product.product_id)}
                                style={{
                                    padding: '8px 15px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Your cart is empty or loading...</p>
                )}
            </div>

            {/* User Information Form */}
            <div style={{ marginBottom: '20px' }}>
                <h2>User Information</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={userInfo.name}
                            disabled
                            style={{ padding: '5px', width: '100%', backgroundColor: '#f0f0f0' }}
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={userInfo.email}
                            disabled
                            style={{ padding: '5px', width: '100%', backgroundColor: '#f0f0f0' }}
                        />
                    </label>
                    <label>
                        Tax ID:
                        <input
                            type="text"
                            name="tax_id"
                            value={userInfo.tax_id}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '5px', width: '100%' }}
                        />
                    </label>
                    <label>
                        Address:
                        <textarea
                            name="address"
                            value={userInfo.address}
                            onChange={handleInputChange}
                            required
                            style={{ padding: '5px', width: '100%', height: '60px' }}
                        />
                    </label>
                </form>
            </div>

            {/* Save Button */}
            <button
                onClick={handleOrder}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isOrderEnabled ? 'blue' : 'gray',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isOrderEnabled ? 'pointer' : 'not-allowed',
                }}
            >
                Place Order
            </button>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={closePaymentModal}
                onPaymentSuccess={() => {
                    alert("Payment successful! Order placed.");
                    closePaymentModal();
                }}
            />

            <Footer />
        </div>
    );
};

export default CheckoutPage;
