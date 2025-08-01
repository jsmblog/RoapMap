import CryptoJS from"crypto-js";
import { VITE_SECRET_KEY } from "../config/config";
export const decrypt=t=>{try{const r=CryptoJS.AES.decrypt(t,VITE_SECRET_KEY);return r.toString(CryptoJS.enc.Utf8)}catch(t){}};