import { useState } from 'react';
import { getStorageData, setStorageData, KEYS, initStorage } from '../../services/storageService';
import { AuthContext } from './authContextObj';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        initStorage();
        return getStorageData(KEYS.SESSION) || null;
    });

    const [usersList, setUsersList] = useState(() => {
        initStorage();
        return getStorageData(KEYS.USERS) || [];
    });

    const login = (email, password) => {
        const foundUser = usersList.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);
            setStorageData(KEYS.SESSION, foundUser);
            return { success: true };
        }
        return { success: false, message: 'Credenciales inválidas' };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(KEYS.SESSION);
    };

    const register = (newUser) => {
        const exists = usersList.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase());
        if (exists) {
            return { success: false, message: 'El correo ya está registrado' };
        }
        const createdUser = {
            id: `user-${Date.now()}`,
            ...newUser,
            role: 'client'
        };
        const updatedUsers = [...usersList, createdUser];
        setUsersList(updatedUsers);
        setStorageData(KEYS.USERS, updatedUsers);

        setUser(createdUser);
        setStorageData(KEYS.SESSION, createdUser);
        return { success: true };
    };

    const updateProfile = (updatedData) => {
        if (!user) return;
        const updatedUser = { ...user, ...updatedData };
        const updatedList = usersList.map((u) => (u.id === user.id ? updatedUser : u));

        setUser(updatedUser);
        setUsersList(updatedList);
        setStorageData(KEYS.SESSION, updatedUser);
        setStorageData(KEYS.USERS, updatedList);
    };

    return (
        <AuthContext.Provider value={{ user, usersList, login, logout, register, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};