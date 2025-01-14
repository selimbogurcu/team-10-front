// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import UserProfile from './pages/UserProfile';
import CartPage from './pages/CartPage';
import AuthProvider from './contexts/AuthContexts';
import CartProvider from './contexts/CartContexts';
import PrivateRoutes from './routes/PrivateRoutes';
import CheckoutPage from './pages/CheckoutPage';
import ProductManager from './pages/ProductManager';
import SalesManager from './pages/SalesManager';
import Wishlist from './pages/Wishlist';

function App() {
    return (
        <AuthProvider> {/* Kullanıcı oturumu için AuthProvider */}
            <CartProvider> {/* Alışveriş sepeti için CartProvider */}
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/category/:categoryName" element={<ProductList />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path='/wishlist' element={<Wishlist/>} />
                        
                        {/* Sadece giriş yapmış herkes için (rol farketmez) */}
                        <Route
                            path="/checkout"
                            element={<PrivateRoutes element={<CheckoutPage />} />}
                        />

                        {/* Sadece "Product Manager" rolüne sahip kullanıcılar */}
                        <Route
                            path="/product-manager"
                            element={
                                <PrivateRoutes
                                    element={<ProductManager />}
                                    allowedRoles={['product_manager']}
                                />
                            }
                        />

                        {/* Sadece "Sales Manager" rolüne sahip kullanıcılar */}
                        <Route
                            path="/sales-manager"
                            element={
                                <PrivateRoutes
                                    element={<SalesManager />}
                                    allowedRoles={['sales_manager']}
                                />
                            }
                        />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
