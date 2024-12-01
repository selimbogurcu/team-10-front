import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContexts';
import { useAuth } from '../contexts/AuthContexts'; // Kullanıcı bilgilerini almak için AuthContext

const CheckoutPage = () => {
    const { cart } = useCart(); // Sepet verisini al
    const { user } = useAuth(); // Kullanıcı bilgilerini al
    const [products, setProducts] = useState([]); // API'den gelen ürün detayları
    const [userInfo, setUserInfo] = useState({
        name: user?.name || '', // Kullanıcı adı
        email: user?.email || '', // Kullanıcı e-postası
        tax_id: '', // Vergi numarası
        address: '', // Adres
    });
    const [isOrderEnabled, setIsOrderEnabled] = useState(false); // Sipariş butonu durumu

    // Backend'den ürün bilgilerini getir
    useEffect(() => {
        const fetchProducts = async () => {
            const productDetails = await Promise.all(
                cart.map(async (cartItem) => {
                    try {
                        const response = await fetch(`http://localhost:1337/api/products/${cartItem.id}`);
                        const data = await response.json();
                        return {
                            ...data, // Backend'den gelen ürün bilgileri
                            count: cartItem.count, // Sepetteki ürün sayısını ekle
                        };
                    } catch (error) {
                        console.error(`Ürün bilgisi alınırken hata oluştu (ID: ${cartItem.id}):`, error);
                        return null; // Hata durumunda null dönebilir
                    }
                })
            );

            setProducts(productDetails.filter((item) => item !== null)); // Hatalı ürünleri filtrele
        };

        fetchProducts();
    }, [cart]);

    // Kullanıcı bilgileri dolduruldu mu kontrol et
    useEffect(() => {
        const isFormFilled = userInfo.tax_id.trim() !== '' && userInfo.address.trim() !== '';
        setIsOrderEnabled(isFormFilled);
    }, [userInfo]);

    // Kullanıcı bilgilerini güncelleme
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
    };

    // Sipariş Ver butonu tıklandığında yapılacak işlem
    const handleOrder = () => {
        console.log('Sipariş Verildi:', { products, userInfo });
        alert('Siparişiniz başarıyla oluşturuldu!');
    };

    return (
        <div>
            <Navbar />
            <h1>Checkout Page</h1>
            <p>Review your cart items and enter your information below:</p>

            {/* Ürün Listesi */}
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

            {/* Kullanıcı Bilgileri Formu */}
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

            {/* Sipariş Ver Butonu */}
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
