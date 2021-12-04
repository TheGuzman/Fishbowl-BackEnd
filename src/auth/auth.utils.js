import crypto from 'crypto';

// creamos una clave para la codificación
const salt= 'secret_fishbowl';

/**
 * Esta función codifica la password que recibe como parámetro y la devuelve
 */
export const encodePassword = (pass) => {
    // utilizamos la librería crypto para codificarla haciendo uso de 1000 iteraciiones
    return crypto.pbkdf2Sync(pass, salt,1000, 64, `sha512`).toString(`hex`);
}

/**
 * Genera un token random de 128 caracteres en base64 para la validación de email
 */
export const generateRandomEmailToken = () => {
    return crypto.randomBytes(128).toString('hex');
}