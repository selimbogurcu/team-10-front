import React, { createContext, useContext, useEffect, useState } from "react";
import CartProductDm from "../domain/CartProductDm"; // Modeli içe aktar

const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        // LocalStorage'dan sepeti yükle
        const savedCart = localStorage.getItem("shoppingCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Sepeti LocalStorage'a kaydet
    useEffect(() => {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }, [cart]);

    // Sepete ürün ekle
    const addToCart = (product) => {
        setCart((prevCart) => {
            // Ürün sepette zaten var mı kontrol et
            const existingProduct = prevCart.find((item) => item.id === product.id);
    
            if (existingProduct) {
                const updatedCart = prevCart.map((item) =>
                    item.id === product.id
                        ? new CartProductDm(
                              item.id,
                              item.name,
                              item.price,
                              item.count + 1 // Mevcut sayıya 1 ekle
                          )
                        : item
                );
    
                console.log("Ürün eklendi (miktar güncellendi):", product);
                console.log("Mevcut Sepet Durumu:", updatedCart);
    
                return updatedCart;
            }
    
            const newProduct = new CartProductDm(
                product.id,
                product.name,
                product.price,
                product.count || 1 // Varsayılan olarak 1
            );
    
            const updatedCart = [...prevCart, newProduct];
    
            console.log("Yeni ürün eklendi:", newProduct);
            console.log("Mevcut Sepet Durumu:", updatedCart);
    
            return updatedCart;
        });
    };
    

    // Sepetten ürün çıkar
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    // Sepeti temizle
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// CartContext'i kullanmak için hook
export const useCart = () => {
    return useContext(CartContext);
};

export default CartProvider;
