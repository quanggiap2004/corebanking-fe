// Currency formatter
export const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(amount);
};

// Date formatter
export const formatDate = (isoString) => {
    if (!isoString) return '';

    const date = new Date(isoString);

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

// Account number masker
export const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return '';

    // "ACC1738658758412" → "**** **** **** 8412"
    const lastFour = accountNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
};

// Format account type
export const formatAccountType = (type) => {
    if (!type) return '';
    return type.charAt(0) + type.slice(1).toLowerCase();
};

// Get status color
export const getStatusColor = (status) => {
    const colors = {
        ACTIVE: 'bg-green-100 text-green-800',
        FROZEN: 'bg-yellow-100 text-yellow-800',
        CLOSED: 'bg-red-100 text-red-800',
        COMPLETED: 'bg-green-100 text-green-800',
        PENDING: 'bg-yellow-100 text-yellow-800',
        FAILED: 'bg-red-100 text-red-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
};

// Get action type color
export const getActionTypeColor = (actionType) => {
    const colors = {
        DEPOSIT: 'bg-green-100 text-green-800',
        WITHDRAWAL: 'bg-red-100 text-red-800',
        TRANSFER: 'bg-blue-100 text-blue-800',
        INTEREST: 'bg-purple-100 text-purple-800',
    };

    return colors[actionType] || 'bg-gray-100 text-gray-800';
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

// Format transaction type
export const getTransactionIcon = (type) => {
    const icons = {
        DEBIT: '↓',
        CREDIT: '↑',
        TRANSFER: '↔',
    };

    return icons[type] || '•';
};

// Get amount color based on transaction type
export const getAmountColor = (type, amount) => {
    if (amount > 0 || type === 'CREDIT') {
        return 'text-green-600';
    } else if (amount < 0 || type === 'DEBIT') {
        return 'text-red-600';
    }
    return 'text-gray-600';
};
