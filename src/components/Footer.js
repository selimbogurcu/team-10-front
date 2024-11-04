import React from 'react';
import '../assets/styles/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>Lorem ıpsum cart curt.</p>
                </div>
                <div className="footer-section">
                    <h3>Customer Service</h3>
                    <ul>
                        <li>Contact Us</li>
                        <li>FAQ</li>
                        <li>Return Policy</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <ul className="social-icons">
                        <li><i className="fab fa-facebook"></i></li>
                        <li><i className="fab fa-twitter"></i></li>
                        <li><i className="fab fa-instagram"></i></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} TEAM10. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
