/**
 * Formats a numeric salary value into a human-readable string (e.g., 1.5L, 50k, 1.2Cr).
 * @param {number|string} val - The numeric value to format.
 * @returns {string} The formatted salary string.
 */
export const formatSalary = (val) => {
    if (!val) return '0';
    const num = Number(val);
    if (isNaN(num)) return '0';
    
    if (num >= 10000000) {
        const cr = num / 10000000;
        return cr % 1 === 0 ? cr + 'Cr' : cr.toFixed(1) + 'Cr';
    }
    if (num >= 100000) {
        const lakhs = num / 100000;
        return lakhs % 1 === 0 ? lakhs + 'L' : lakhs.toFixed(1) + 'L';
    }
    if (num >= 1000) {
        const k = num / 1000;
        return k % 1 === 0 ? k + 'k' : k.toFixed(1) + 'k';
    }
    return num.toString();
};

/**
 * Returns a human-readable "time ago" string for a given timestamp.
 * @param {string|Date} timestamp - The timestamp to compare.
 * @returns {string} A string like "Today", "Yesterday", or "2d ago".
 */
export const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInDays = Math.floor(diffInSeconds / (60 * 60 * 24));

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
};

/**
 * Standard date formatter for high-fidelity displays.
 * @param {string|Date} timestamp 
 * @returns {string} 
 */
export const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Simple date formatter (e.g., MMM D, YYYY).
 * @param {string|Date} timestamp 
 * @returns {string} 
 */
export const formatDateSimple = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
};
