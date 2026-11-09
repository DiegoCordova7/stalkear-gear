const API_BASE_URL = import.meta.env.PROD
    ? 'https://stalkear-gear-backend.onrender.com/api'
    : 'http://localhost:8080/api';

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
        throw new Error('Error al conectar con el servidor para obtener los productos.');
    }
    return response.json();
};

export const fetchProductById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error('Producto no encontrado.');
    }
    return response.json();
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Credenciales inválidas');
    }
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al registrar usuario');
    }
    return response.json();
};

export const updateUserProfile = async (userId, updatedData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el perfil en el servidor.');
    }
    return response.json();
};