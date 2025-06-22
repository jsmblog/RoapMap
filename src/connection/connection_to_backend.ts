import axios from 'axios';
import { VITE_LINK_FIREBASE_FUNCTIONS } from '../config/config';
const BASE_URL = `${VITE_LINK_FIREBASE_FUNCTIONS}`;
export const connection = axios.create({
  baseURL: BASE_URL,
});

