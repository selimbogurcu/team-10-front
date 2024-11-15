import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContexts'; // AuthContext'i içe aktarın
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import '../assets/styles/modal.css'; 

const UserModal = ({ onClose }) => {
    const { login } = useAuth(); // AuthContext'ten login fonksiyonunu alın
    const [isLogin, setIsLogin] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = isLogin 
            ? 'http://localhost:1337/api/auth/login' 
            : 'http://localhost:1337/api/auth/register';

        const payload = isLogin  
            ? { email: formData.email, password: formData.password }
            : {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'User',         // Default role
                tax_id: '-',          // Default tax ID
                address: '-'          // Default address
            };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (response.ok) {
                alert(isLogin ? 'Login successful!' : 'Registration successful!');
                login(data.token); // AuthContext'e token gönder
                handleClose();
            } else {
                alert(data.error || 'An error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred.');
        }
    };

    return (
        <div className={`modal-overlay ${isClosing ? 'fadeOut' : ''}`} onClick={handleClose}>
            <div
                className={`modal-content ${isClosing ? 'slideOut' : ''}`}
            >
                <button className="close-button" onClick={handleClose}>✕</button>
                <h2>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>

                <div className="tabs">
                    <span 
                        className={`tab ${isLogin ? 'active' : ''}`} 
                        onClick={() => setIsLogin(true)}>
                        SIGN IN
                    </span>
                    <span 
                        className={`tab ${!isLogin ? 'active' : ''}`} 
                        onClick={() => setIsLogin(false)}>
                        I'M NEW HERE
                    </span>
                </div>

                <form onSubmit={handleSubmit}>
                    {isLogin ? (
                        <>
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email address" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                            <a href="#" className="forgot-password">Forgot your password?</a>
                            <button type="submit" className="sign-in-button">Sign In</button>
                        </>
                    ) : (
                        <>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Username" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Email address" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                            />
                            <button type="submit" className="register-button">Register</button>
                        </>
                    )}
                </form>

                <p className="or-divider">OR</p>

                <div className="social-buttons">
                    <button className="social-button google"><FaGoogle /> Continue with Google</button>
                    <button className="social-button apple"><FaApple /> Continue with Apple</button>
                    <button className="social-button facebook"><FaFacebook /> Continue with Facebook</button>
                </div>
            </div>
        </div>
    );
};

export default UserModal;
