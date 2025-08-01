import CryptoJS from 'crypto-js';
import { VITE_SECRET_KEY } from '../config/config';

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, VITE_SECRET_KEY).toString();
}