import { request } from './client';

export const validateStock = (items) =>
    request('/orders/validate-stock', {
        method: 'POST',
        body: items,
        defaultError: 'Error al validar stock',
    });

export const createOrder = (orderData) =>
    request('/orders', {
        method: 'POST',
        body: orderData,
        defaultError: 'Error al procesar el pedido',
    });

export const createOrderFromCart = (userId, checkoutData) =>
    request(`/orders/from-cart/${userId}`, {
        method: 'POST',
        body: checkoutData,
        defaultError: 'Error al generar la orden desde el carrito',
    });

export const getAllOrders = () =>
    request('/orders', { defaultError: 'Error al obtener los pedidos' });

export const getOrdersByUser = (userId) =>
    request(`/orders/user/${userId}`, { defaultError: 'Error al obtener tus pedidos' });

export const updateOrderStatus = (orderId, status) =>
    request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status },
        defaultError: 'Error al actualizar el estado del pedido',
    });