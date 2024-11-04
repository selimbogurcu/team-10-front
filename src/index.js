import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/main.css';  // Ana CSS dosyasını burada ekliyoruz
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
