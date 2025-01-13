import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContexts';
import { useAuth } from '../contexts/AuthContexts';
import PaymentModal from '../components/PaymentModal'; 
import Modal from 'react-modal'; // react-modal veya herhangi bir modal kütüphanesi kullanılabilir

Modal.setAppElement('#root'); // Accessibility için zorunlu (React Modal)

const CheckoutPage = () => {
    const { cart, decreaseQuantity, clearCart } = useCart();
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
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); 
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Başarılı ödeme pop-up'ı
    const [orderDetails, setOrderDetails] = useState(null); // Sipariş bilgileri

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

    useEffect(() => {
        const isFormFilled = userInfo.tax_id.trim() !== '' && userInfo.address.trim() !== '';
        setIsOrderEnabled(isFormFilled);
        setIsSaveEnabled(isFormFilled);
    }, [userInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    const handleOrder = async () => {
        const orderPayload = {
            user_id: user.userIdNumber,
            total_price: products.reduce((total, product) => total + product.price * product.count, 0),
            status: 'processing',
            delivery_address: userInfo.address,
            items: products.map((product) => ({
                product_id: product.product_id,
                quantity: product.count,
                price: product.price,
            })),
        };

        try {
            const response = await fetch('http://localhost:1337/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                throw new Error('Failed to create order.');
            }

            const data = await response.json();
            setOrderDetails({
                orderId: data.orderId,
                totalPrice: orderPayload.total_price,
                items: products,
            }); // Sipariş detaylarını kaydet
            setIsSuccessModalOpen(true); // Başarı pop-up'ını aç
            clearCart(); // Sepeti temizle
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while processing your order.');
        }
    };

    const closeModal = () => {
        setIsSuccessModalOpen(false); // Modal'ı kapat
        setOrderDetails(null); // Sipariş bilgilerini sıfırla
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

            {/* Place Order Button */}
            <button
                onClick={() => setIsPaymentModalOpen(true)} // Modal açılır
                disabled={!isOrderEnabled}
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
                onClose={() => setIsPaymentModalOpen(false)}
                handleOrder={handleOrder} 
            />

            {/* Success Modal */}
            <Modal
                isOpen={isSuccessModalOpen}
                onRequestClose={closeModal}
                contentLabel="Order Success"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '10px',
                        padding: '20px',
                        maxWidth: '400px',
                    },
                }}
            >
                <h2>Order Successful!</h2>
                {orderDetails && (
                    <div>
                        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
                        <p><strong>Total Price:</strong> {orderDetails.totalPrice} ₺</p>
                        <p><strong>Products:</strong></p>
                        <ul>
                            {orderDetails.items.map((item, index) => (
                                <li key={index}>
                                    {item.name} - {item.price} ₺ x {item.count}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <button
                    onClick={closeModal}
                    style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Close
                </button>
            </Modal>

            <Footer />
        </div>
    );
};

export default CheckoutPage;
