"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext({
    isAuthenticated: false,
    admin: null,
    login: () => {},
    logout: () => {}
});

export function AdminAuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const adminData = localStorage.getItem('admin_data');
        
        if (token && adminData) {
            setIsAuthenticated(true);
            setAdmin(JSON.parse(adminData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setIsAuthenticated(true);
                setAdmin(data.admin);
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_data', JSON.stringify(data.admin));
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (error) {
            return { success: false, error: 'Network error' };
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAdmin(null);
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
    };

    return (
        <AdminAuthContext.Provider value={{ isAuthenticated, admin, login, logout, loading }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export const useAdminAuth = () => useContext(AdminAuthContext);