const KEYS = {
    SESSION: 'stalkear_session',
    CART: 'stalkear_cart',
    ORDERS: 'stalkear_orders'
};

export const initStorage = () => {
    if (!localStorage.getItem(KEYS.CART)) localStorage.setItem(KEYS.CART, JSON.stringify([]));
    if (!localStorage.getItem(KEYS.ORDERS)) localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
};

export const getStorageData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const setStorageData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export { KEYS };