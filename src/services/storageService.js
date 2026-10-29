import { INITIAL_PRODUCTS, INITIAL_USERS } from '../data/initialData';

const KEYS = {
    PRODUCTS: 'stalkear_products',
    USERS: 'stalkear_users',
    SESSION: 'stalkear_session',
    CART: 'stalkear_cart',
    ORDERS: 'stalkear_orders'
};

export const initStorage = () => {
    if (!localStorage.getItem(KEYS.PRODUCTS)) localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
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