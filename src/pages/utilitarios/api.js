// api.js
import { API_URL } from '../../../config';

// Função para registrar um novo usuário
export const registerUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Falha no registro');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw error;
    }
};

// Função para fazer login
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (!response.ok) {
            throw new Error('Falha no login');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
};

// Função para buscar dados do usuário
export const getUserData = async (userId, token) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Falha ao buscar dados do usuário');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        throw error;
    }
};

// Função para atualizar dados do usuário
export const updateUserData = async (userId, token, userData) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Falha ao atualizar dados do usuário');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        throw error;
    }
};

// Função genérica para fazer requisições autenticadas
export const authenticatedRequest = async (url, method, token, body = null) => {
    try {
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
        if (body) {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(`${API_URL}${url}`, options);
        if (!response.ok) {
            throw new Error('Falha na requisição');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro na requisição autenticada:', error);
        throw error;
    }
};