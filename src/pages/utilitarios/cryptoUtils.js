// src/utils/cryptoUtils.js
import * as Crypto from 'expo-crypto';

export const hashPassword = async (password) => {
    try {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
        );
        return digest;
    } catch (error) {
        console.error('Erro ao criar hash da senha:', error);
        throw error;
    }
};