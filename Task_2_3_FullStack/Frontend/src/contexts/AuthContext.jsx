import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('urban_harvest_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            const sessionUser = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role || 'member'
            };
            setUser(sessionUser);
            localStorage.setItem('urban_harvest_user', JSON.stringify(sessionUser));
            return sessionUser;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            const sessionUser = {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role || 'member'
            };
            setUser(sessionUser);
            localStorage.setItem('urban_harvest_user', JSON.stringify(sessionUser));
            return sessionUser;
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    };

    // addOrder is deprecated/removed as we now use backend BookingService
    // const addOrder = (order) => { ... }

    const logout = () => {
        authService.logout();
        setUser(null);
        localStorage.removeItem('urban_harvest_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
