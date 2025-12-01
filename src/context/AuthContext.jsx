import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing user session
        const loadUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();

                // Check if user is suspended
                if (currentUser && currentUser.suspended) {
                    await authService.logout();
                    alert('Your account has been suspended. Please contact the administrator.');
                    setUser(null);
                } else {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const loggedInUser = await authService.login(email, password);
            setUser(loggedInUser);
            await authService.setCurrentUser(loggedInUser);
            return loggedInUser;
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password, name, role) => {
        console.log('[AuthContext] register called');
        try {
            const newUser = await authService.register(email, password, name, role);
            console.log('[AuthContext] register success, setting user');
            setUser(newUser);
            await authService.setCurrentUser(newUser);
            return newUser;
        } catch (error) {
            console.error('[AuthContext] register error:', error);
            throw error;
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const updateProfile = async (updates) => {
        try {
            const updatedUser = await authService.updateProfile(user.id, updates);
            setUser(updatedUser);
            await authService.setCurrentUser(updatedUser);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isInstructor: user?.role === 'instructor',
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
