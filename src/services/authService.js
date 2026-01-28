import api from './api';

// Login
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// Register
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

// Store auth data
export const storeAuthData = (token, username, userId = null, transactionLimit = null) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
    if (userId) {
        localStorage.setItem('userId', userId);
    }
    if (transactionLimit) {
        localStorage.setItem('transactionLimit', transactionLimit);
    }
};

// Get stored auth data
export const getAuthData = () => {
    const transactionLimit = localStorage.getItem('transactionLimit');
    return {
        token: localStorage.getItem('authToken'),
        username: localStorage.getItem('username'),
        userId: localStorage.getItem('userId'),
        transactionLimit: transactionLimit ? parseFloat(transactionLimit) : null,
    };
};

// Clear auth data
export const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('transactionLimit');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('authToken');
    return !!token;
};
