import api from './api';

/**
 * Execute a deposit to an account
 * @param {Object} depositData - Deposit request data
 * @returns {Promise} Deposit response
 */
export const executeDeposit = async (depositData) => {
    const response = await api.post('/deposits', depositData);
    return response.data;
};
