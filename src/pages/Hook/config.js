// config.js
import { Platform } from 'react-native';

const localIP = '192.168.137.216'; // Alterar aqui se necessário
const port = '3001';

export const baseURL = Platform.OS === 'android'
    ? `http://${localIP}:${port}`
    : `http://localhost:${port}`;
