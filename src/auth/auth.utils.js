import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// codification key
const salt= process.env.SALT;
const digest = process.env.DIGEST
/**
 * Returns encoded password
 */
export const encodePassword = (pass) => {
    return crypto.pbkdf2Sync(pass, salt,1000, 64, digest).toString(`hex`);
}

/**
 * Generates a 128 character token 
 */
export const generateRandomEmailToken = () => {
    return crypto.randomBytes(128).toString('hex');
}