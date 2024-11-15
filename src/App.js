import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import UserProfile from './pages/UserProfile';
import AuthProvider from './contexts/AuthContexts'; // AuthProvider'ı içe aktarın

function App() {
    return (
        <AuthProvider> {/* Uygulamayı AuthProvider ile sarın */}
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/category/:category" element={<ProductList />} />
                    <Route path="/profile" element={<UserProfile />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
