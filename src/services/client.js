export const API_BASE_URL = import.meta.env.PROD
    ? 'https://stalkear-gear-backend.onrender.com/api'
    : 'http://localhost:8080/api';

export async function request(endpoint, { method = 'GET', body, defaultError = 'Error en la petición' } = {}) {
    const config = { method };

    if (body !== undefined) {
        config.headers = { 'Content-Type': 'application/json' };
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || err.message || defaultError);
        }
        const text = await response.text().catch(() => '');
        throw new Error(text || defaultError);
    }

    if (response.status === 204) return null;
    return response.json();
}