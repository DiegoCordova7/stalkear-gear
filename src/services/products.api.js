import { request } from './client';

export const fetchProducts = () =>
    request('/products', { defaultError: 'Error al conectar con el servidor para obtener los productos.' });

export const fetchProductById = (id) =>
    request(`/products/${id}`, { defaultError: 'Producto no encontrado.' });

export const createProduct = (productData) =>
    request('/products', { method: 'POST', body: productData, defaultError: 'Error al registrar el producto' });

export const updateProduct = (id, productData) =>
    request(`/products/${id}`, { method: 'PUT', body: productData, defaultError: 'Error al actualizar el producto' });

export const updateProductStock = (id, stock) =>
    request(`/products/${id}/stock`, { method: 'PUT', body: { stock }, defaultError: 'Error al actualizar el stock' });

export const deleteProduct = async (id) => {
    await request(`/products/${id}`, { method: 'DELETE', defaultError: 'Error al eliminar el producto' });
    return true;
};