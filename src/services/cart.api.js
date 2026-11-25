import { request } from './client';

export const fetchCart = (userId) =>
    request(`/cart/${userId}`, { defaultError: 'Error al obtener el carrito.' });

export const addCartItem = (userId, productId, quantity = 1) =>
    request(`/cart/${userId}/items`, {
        method: 'POST',
        body: { productId, quantity },
        defaultError: 'Error al agregar producto al carrito',
    });

export const updateCartItemQuantity = (userId, productId, quantity) =>
    request(`/cart/${userId}/items/${productId}`, {
        method: 'PATCH',
        body: { quantity },
        defaultError: 'Error al actualizar cantidad en el carrito',
    });

export const removeCartItem = (userId, productId) =>
    request(`/cart/${userId}/items/${productId}`, {
        method: 'DELETE',
        defaultError: 'Error al eliminar el producto del carrito',
    });

export const clearRemoteCart = (userId) =>
    request(`/cart/${userId}`, {
        method: 'DELETE',
        defaultError: 'Error al vaciar el carrito',
    });