import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContexts';
import { useAuth } from '../contexts/AuthContexts';

const CheckoutPage = () => {
    const { cart } = useCart(); // Cart data
    const { user } = useAuth(); // User data
    const [products, setProducts] = useState([]); // Product details
    const [userInfo, setUserInfo] = useState({
        name: user?.name || '',
        email: '',
        tax_id: '',
        address: '',
    });

    const [isOrderEnabled, setIsOrderEnabled] = useState(false);
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

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
                        return {
                            ...data,
                            count: cartItem.count,
                        };
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

    // Save user information
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

    // Place order when the "Place Order" button is clicked
    const handleOrder = async () => {
        const orderPayload = {
            user_id: user.userIdNumber,
            total_price: products.reduce((total, product) => total + product.price * product.count, 0),
            status: 'Pending',
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
            alert(`Order placed successfully! Order ID: ${data.orderId}`);
            console.log('Order created:', data);
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing your order.');
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
                onClick={handleOrder}
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

            <Footer />
        </div>
    );
};

export default CheckoutPage;
