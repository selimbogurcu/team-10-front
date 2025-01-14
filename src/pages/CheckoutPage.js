import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContexts';
import { useAuth } from '../contexts/AuthContexts';
import PaymentModal from '../components/PaymentModal'; 

const CheckoutPage = () => {   //giriş bilgileri
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

    // kullanıcı bilgilerinin updatelenmesi
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
            // Sipariş oluştur
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
            alert(`Order placed successfully! Order ID: ${data.orderId}`);
    
            // PDF talep et
            const pdfResponse = await fetch(`http://localhost:1337/api/orders/${data.orderId}/sendpdf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!pdfResponse.ok) {
                throw new Error('Failed to send order PDF.');
            }
    
            // PDF yanıtını blob olarak al
            const pdfBlob = await pdfResponse.blob();
            const fileURL = URL.createObjectURL(pdfBlob);
    
            // PDF'i yeni bir sekmede aç
            window.open(fileURL);
    
            alert('Order PDF generated successfully!');
            clearCart(); // Sepeti temizle
        } catch (error) {
            console.error('Error placing order or sending PDF:', error);
            alert('An error occurred while processing your order.');
        }
    };
        

    
    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/users/${user.userIdNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tax_id: userInfo.tax_id,
                    address: userInfo.address,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user information.');
            }

            const data = await response.json();
            alert('Your information has been updated successfully!');
            console.log('User information updated:', data);
        } catch (error) {
            console.error('Error updating user information:', error);
            alert('An error occurred while updating your information.');
        }
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
                onClick={handleSave}
                disabled={!isSaveEnabled}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isSaveEnabled ? 'green' : 'gray',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: isSaveEnabled ? 'pointer' : 'not-allowed',
                    marginRight: '10px',
                }}
            >
                Save
            </button>

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
                handleOrder={handleOrder} // handleOrder fonksiyonunu buradan geçiriyoruz
            />

            <Footer />
        </div>
    );
};

export default CheckoutPage;
