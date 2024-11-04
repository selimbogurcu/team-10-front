import React, { useState } from 'react';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import '../assets/styles/modal.css'; 

const UserModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300); // Animasyon süresi ile uyumlu (300ms)
    };

    return (
        <div className={`modal-overlay ${isClosing ? 'fadeOut' : ''}`} onClick={handleClose}>
            <div className={`modal-content ${isClosing ? 'slideOut' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose}>✕</button>
                <h2>Come on in</h2>
                
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

                <form>
                    {isLogin ? (
                        <>
                            <input type="email" placeholder="Email address" required />
                            <input type="password" placeholder="Password" required />
                            <a href="#" className="forgot-password">Forgot your password?</a>
                            <button type="submit" className="sign-in-button">Sign In</button>
                        </>
                    ) : (
                        <>
                            <input type="text" placeholder="Username" required />
                            <input type="email" placeholder="Email address" required />
                            <input type="password" placeholder="Password" required />
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
