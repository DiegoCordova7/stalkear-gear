import { useState } from 'react';
import { getStorageData, setStorageData, KEYS, initStorage } from '../../services/storageService';
import { AuthContext } from './authContextObj';
import { loginUser, registerUser, updateUserProfile } from '../../services/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        initStorage();
        return getStorageData(KEYS.SESSION) || null;
    });

    const login = async (email, password) => {
        try {
            const loggedUser = await loginUser({ email, password });
            setUser(loggedUser);
            setStorageData(KEYS.SESSION, loggedUser);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message || 'Credenciales inválidas' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(KEYS.SESSION);
    };

    const register = async (newUser) => {
        try {
            const createdUser = await registerUser(newUser);
            setUser(createdUser);
            setStorageData(KEYS.SESSION, createdUser);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message || 'Error al registrar usuario' };
        }
    };

    const updateProfile = async (updatedData) => {
        if (!user) return { success: false, message: 'No hay sesión activa' };

        try {
            const updatedUserFromApi = await updateUserProfile(user.id, updatedData);
            setUser(updatedUserFromApi);
            setStorageData(KEYS.SESSION, updatedUserFromApi);
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};