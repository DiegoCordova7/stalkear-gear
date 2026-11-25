import { useState, useEffect, useCallback } from 'react';
import { getStorageData, setStorageData, KEYS, initStorage } from '../../services/storageService';
import { CartContext } from './cartContextObj';
import { useAuth } from '../auth/useAuth';
import {
    fetchProducts,
    validateStock as apiValidateStock,
    createOrder as apiCreateOrder,
    fetchCart,
    addCartItem,
    updateCartItemQuantity,
    removeCartItem,
    clearRemoteCart,
    createOrderFromCart,
    createPaymentIntent,
} from '../../services/api';

const mapBackendCartItems = (backendItems = [], catalog = []) =>
    backendItems.map((item) => {
        const prod = catalog.find((p) => p.id === item.productId);
        return {
            id: item.productId,
            nombre: item.productName || prod?.nombre || item.productId,
            precio: item.unitPrice ?? prod?.precio ?? 0,
            imagen: item.productImage || prod?.imagen || '',
            stock: item.availableStock ?? prod?.stock ?? 99,
            cantidad: item.quantity,
        };
    });

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const userId = user?.id && user.id !== 'anonimo' ? user.id : null;

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

    const saveCart = (newCart) => {
        setCart(newCart);
        setStorageData(KEYS.CART, newCart);
    };

    const saveProducts = (newProducts) => {
        setProducts(newProducts);
    };

    useEffect(() => {
        let active = true;
        fetchProducts()
            .then((data) => {
                if (!active) return;
                setProducts(data);
                setLoadingProducts(false);
                if (userId) {
                    return fetchCart(userId).then((cartRes) => {
                        if (!active || !cartRes?.items) return;
                        saveCart(mapBackendCartItems(cartRes.items, data));
                    });
                }
            })
            .catch((err) => {
                console.error('Error al conectar con Spring Boot:', err);
                if (active) setLoadingProducts(false);
            });

        return () => {
            active = false;
        };
    }, [userId]);

    const addToCart = async (product, quantity = 1) => {
        const existingIndex = cart.findIndex((item) => item.id === product.id);
        const newCart = [...cart];
        const targetStock = product.stock ?? 99;
        let nextQty = Math.min(quantity, targetStock);

        if (existingIndex >= 0) {
            const currentQty = newCart[existingIndex].cantidad;
            nextQty = Math.min(currentQty + quantity, targetStock);
            newCart[existingIndex] = {
                ...newCart[existingIndex],
                cantidad: nextQty,
                stock: targetStock,
            };
        } else {
            newCart.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                stock: targetStock,
                cantidad: nextQty,
            });
        }
        saveCart(newCart);

        if (userId) {
            try {
                const updated = await addCartItem(userId, product.id, quantity);
                if (updated?.items) saveCart(mapBackendCartItems(updated.items, products));
            } catch (err) {
                console.error('Error sincronizando addToCart con backend:', err);
            }
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        let resolvedQty = newQuantity;

        const updatedCart = cart.map((item) => {
            if (item.id === id) {
                const catalogProd = products.find((p) => p.id === id);
                const maxStock = catalogProd ? catalogProd.stock : (item.stock ?? 99);
                resolvedQty = Math.min(newQuantity, maxStock);
                return { ...item, stock: maxStock, cantidad: resolvedQty };
            }
            return item;
        });
        saveCart(updatedCart);

        if (userId) {
            try {
                const updated = await updateCartItemQuantity(userId, id, resolvedQty);
                if (updated?.items) saveCart(mapBackendCartItems(updated.items, products));
            } catch (err) {
                console.error('Error sincronizando updateQuantity con backend:', err);
            }
        }
    };

    const removeFromCart = async (productId) => {
        const newCart = cart.filter((item) => item.id !== productId);
        saveCart(newCart);

        if (userId) {
            try {
                const updated = await removeCartItem(userId, productId);
                if (updated?.items) saveCart(mapBackendCartItems(updated.items, products));
            } catch (err) {
                console.error('Error sincronizando removeFromCart con backend:', err);
            }
        }
    };

    const clearCart = useCallback(async () => {
        saveCart([]);
        if (userId) {
            try {
                await clearRemoteCart(userId);
            } catch (err) {
                console.error('Error limpiando carrito en backend:', err);
            }
        }
    }, [userId]);

    const getTotal = () => cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    const checkout = async (userArg) => {
        const activeUser = userArg && typeof userArg === 'object' ? userArg : user;
        const activeUserId = activeUser?.id && activeUser.id !== 'anonimo' ? activeUser.id : null;

        if (cart.length === 0) {
            return { success: false, message: 'El carrito está vacío' };
        }

        const itemsPayload = cart.map((item) => ({
            productId: item.id,
            quantity: item.cantidad,
        }));

        try {
            const validation = await apiValidateStock(itemsPayload);
            if (!validation.valid) {
                return { success: false, message: validation.errors.join(', ') };
            }

            let createdOrder;
            if (activeUserId) {
                // Asegura que el carrito en DB tenga lo mismo antes de crear la orden desde carrito
                await clearRemoteCart(activeUserId).catch(() => { });
                for (const item of cart) {
                    await addCartItem(activeUserId, item.id, item.cantidad);
                }

                createdOrder = await createOrderFromCart(activeUserId, {
                    customerName: activeUser?.nombre || 'Cliente Stalker',
                    customerEmail: activeUser?.email || 'cliente@stalkear.com',
                    shippingAddress: activeUser?.direccion || 'Dirección predeterminada / Mostrador',
                    paymentMethod: 'STRIPE',
                });
            } else {
                const orderPayload = {
                    userId: 'anonimo',
                    customerName: 'Cliente Anónimo',
                    customerEmail: 'anonimo@stalkear.com',
                    shippingAddress: 'Dirección predeterminada / Mostrador',
                    paymentMethod: 'STRIPE',
                    items: itemsPayload,
                };
                createdOrder = await apiCreateOrder(orderPayload);
            }

            const intentData = await createPaymentIntent(createdOrder.id);

            const freshProducts = await fetchProducts();
            setProducts(freshProducts);

            const localOrderFormat = {
                id: createdOrder.id,
                userId: createdOrder.userId,
                items: [...cart],
                total: createdOrder.totalAmount,
                fecha: new Date().toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                estado: createdOrder.status,
            };
            const updatedOrders = [localOrderFormat, ...orders];
            setOrders(updatedOrders);
            setStorageData(KEYS.ORDERS, updatedOrders);

            return {
                success: true,
                orderId: createdOrder.id,
                order: createdOrder,
                clientSecret: intentData.clientSecret,
            };
        } catch (err) {
            return { success: false, message: err.message || 'Error al procesar el pedido con el servidor.' };
        }
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
                saveProducts,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};