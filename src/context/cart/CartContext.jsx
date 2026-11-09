import { useState, useEffect } from 'react';
import { getStorageData, setStorageData, KEYS, initStorage } from '../../services/storageService';
import { CartContext } from './cartContextObj';
import { fetchProducts } from '../../services/api';

export const CartProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [cart, setCart] = useState(() => {
        initStorage();
        return getStorageData(KEYS.CART) || [];
    });

    const [orders, setOrders] = useState(() => {
        initStorage();
        return getStorageData(KEYS.ORDERS) || [];
    });

    useEffect(() => {
        fetchProducts()
            .then(data => {
                setProducts(data);
                setLoadingProducts(false);
            })
            .catch(err => {
                console.error("Error al conectar con Spring Boot para los productos:", err);
                setLoadingProducts(false);
            });
    }, []);

    const saveCart = (newCart) => {
        setCart(newCart);
        setStorageData(KEYS.CART, newCart);
    };

    const saveProducts = (newProducts) => {
        setProducts(newProducts);
    };

    const addToCart = (product, quantity = 1) => {
        const existingIndex = cart.findIndex((item) => item.id === product.id);
        let newCart = [...cart];
        const targetStock = product.stock ?? 99;

        if (existingIndex >= 0) {
            const currentQty = newCart[existingIndex].cantidad;
            const newQty = Math.min(currentQty + quantity, targetStock);
            newCart[existingIndex] = {
                ...newCart[existingIndex],
                cantidad: newQty,
                stock: targetStock
            };
        } else {
            newCart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                stock: targetStock,
                cantidad: Math.min(quantity, targetStock)
            });
        }
        saveCart(newCart);
    };

    const updateQuantity = (id, newQuantity) => {
        const updatedCart = cart.map(item => {
            if (item.id === id) {
                if (newQuantity < 1) return item;
                const catalogProd = products.find(p => p.id === id);
                const maxStock = catalogProd ? catalogProd.stock : (item.stock ?? 99);
                const validQuantity = Math.min(newQuantity, maxStock);
                return { ...item, stock: maxStock, cantidad: validQuantity };
            }
            return item;
        });
        saveCart(updatedCart);
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter((item) => item.id !== productId);
        saveCart(newCart);
    };

    const clearCart = () => {
        saveCart([]);
    };

    const getTotal = () => {
        return cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    };

    const checkout = (userId) => {
        if (cart.length === 0) return { success: false, message: 'El carrito está vacío' };
        for (const item of cart) {
            const prod = products.find((p) => p.id === item.id);
            if (!prod || prod.stock < item.cantidad) {
                return { success: false, message: `Stock insuficiente para ${item.nombre}. Disponible: ${prod ? prod.stock : 0}` };
            }
        }

        const updatedProducts = products.map((prod) => {
            const cartItem = cart.find((item) => item.id === prod.id);
            if (cartItem) return { ...prod, stock: prod.stock - cartItem.cantidad };
            return prod;
        });

        const newOrder = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            userId: userId || 'anonimo',
            items: [...cart],
            total: getTotal(),
            fecha: new Date().toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            estado: 'Completado'
        };
        const updatedOrders = [newOrder, ...orders];
        saveProducts(updatedProducts);
        setOrders(updatedOrders);
        setStorageData(KEYS.ORDERS, updatedOrders);
        clearCart();
        return { success: true, orderId: newOrder.id };
    };

    return (
        <CartContext.Provider
            value={{
                products,
                loadingProducts,
                cart,
                orders,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                getTotal,
                checkout,
                saveProducts
            }}
        >
            {children}
        </CartContext.Provider>
    );
};