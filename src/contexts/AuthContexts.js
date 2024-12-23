import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // State'i başlatırken sessionStorage'dan veri yükle
    const [token, setToken] = useState(() => sessionStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const userData = sessionStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    });

    // Login fonksiyonu
    const login = (newToken, userData) => {
        setToken(newToken); // State'i güncelle
        setUser(userData);

        // Session Storage'a kaydet
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("user", JSON.stringify(userData));
    };

    // Logout fonksiyonu
    const logout = () => {
        setToken(null); // State'i temizle
        setUser(null);

        // Session Storage'dan temizle
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext'i kullanmak için hook
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;
