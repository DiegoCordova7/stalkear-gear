import { request } from './client';

export const createPaymentIntent = (orderId) =>
    request(`/payments/create-intent/${orderId}`, {
        method: 'POST',
        defaultError: 'Error al iniciar el pago con Stripe',
    });

export const confirmOrderPayment = (orderId) =>
    request(`/payments/confirm/${orderId}`, {
        method: 'POST',
        defaultError: 'Error al confirmar el pago en el servidor',
    });