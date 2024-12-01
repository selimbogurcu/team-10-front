import React from 'react';
import { useCart } from '../contexts/CartContexts'; // CartProvider hook'u kullanılıyor
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartPage = () => {
    const { cart, removeFromCart, clearCart } = useCart();

    return (
        <div>
            <Navbar></Navbar>
            <h1>Alışveriş Sepeti</h1>
            {cart.length === 0 ? (
                <p>Sepetiniz boş.</p>
            ) : (
                cart.map((item) => (
                    <div key={item.id}>
                        <h2>{item.name}</h2>
                        <p>Adet: {item.quantity}</p>
                        <p>Fiyat: ${item.price}</p>
                        <button onClick={() => removeFromCart(item.id)}>Kaldır</button>
                    </div>
                ))
            )}
            {cart.length > 0 && (
                <>
                    <button onClick={clearCart}>Sepeti Temizle</button>
                    <p>
                        Toplam: $
                        {cart.reduce(
                            (total, item) => total + item.price * item.quantity,
                            0
                        )}
                    </p>
                </>
            )}
            <Footer></Footer>
        </div>
    );
};

export default CartPage;
