import { request } from './client';

export const loginUser = (credentials) =>
    request('/users/login', { method: 'POST', body: credentials, defaultError: 'Credenciales inválidas' });

export const registerUser = (userData) =>
    request('/users/register', { method: 'POST', body: userData, defaultError: 'Error al registrar usuario' });

export const updateUserProfile = (userId, updatedData) =>
    request(`/users/${userId}`, {
        method: 'PUT',
        body: updatedData,
        defaultError: 'Error al actualizar el perfil en el servidor.',
    });

export const getAllUsers = () =>
    request('/users', { defaultError: 'Error al listar los usuarios' });

export const updateUserRole = (userId, role) =>
    request(`/users/${userId}/role`, {
        method: 'PUT',
        body: { role },
        defaultError: 'Error al actualizar el rol del usuario',
    });

export const toggleUserStatus = (userId, active) =>
    request(`/users/${userId}/status`, {
        method: 'PUT',
        body: { active },
        defaultError: 'Error al actualizar el estado de la cuenta',
    });