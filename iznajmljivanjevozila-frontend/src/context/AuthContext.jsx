import { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';

const AuthContext = createContext({
    user: null,
    token: null,
    login: (token, user) => { },
    logout: () => { },
    loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Opciono: Proveri token na backendu
            // Za sad samo decoduj ili veruj da je validan
            // axios.get('/api/user')...
            // Ovde simuliramo da je user ulogovan
            // U realnosti bi ovde išao request ka /api/user
            // setUser({ name: 'Marko', role: 'ADMINISTRATOR' }); // Primer
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("ACCESS_TOKEN", newToken);
        if (newUser) {
            localStorage.setItem("USER_DATA", JSON.stringify(newUser));
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("ACCESS_TOKEN");
        localStorage.removeItem("USER_DATA");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
