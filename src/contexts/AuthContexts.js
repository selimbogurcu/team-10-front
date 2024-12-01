import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null); // Token bilgisi
    const [user, setUser] = useState(null);   // Kullanıcı bilgisi (ör. isim, userIdNumber)

    // Login fonksiyonu
    const login = (newToken, userData) => {
        setToken(newToken);    // Token'i kaydet
        setUser(userData);     // Kullanıcı bilgilerini kaydet (ör. name, userIdNumber)
    };

    // Logout fonksiyonu
    const logout = () => {
        setToken(null);        // Token'i temizle
        setUser(null);         // Kullanıcı bilgilerini temizle
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
