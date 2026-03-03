/* api.js
 Access token memóriában → header-be teszi minden kérésnél.
 Refresh token HttpOnly cookie-ban → a @react-native-cookies/cookies könyvtár 
 vagy a withCredentials: true biztosítja, hogy a /refresh hívásoknál automatikusan elküldődjön.
 Interceptor automatikusan frissíti az access tokent, ha 401 jön.
 Logout törli az access tokent és a cookie-t a szerver oldalon.
*/
// npm install @react-native-cookies/cookies axios
import { Platform } from "react-native";
import axios from "axios";
// csak az install kell !! az import nem
//import { Cookies } from "@react-native-cookies/cookies";

let accessToken = null;

// ------------------- Access token kezelése -------------------
export function setAccessToken(token) {
  accessToken = token;
}

// ------------------- Axios instance -------------------
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL,
  withCredentials: true, // cookie-k kezelése
  timeout: 5000,
});

// Request interceptor – hozzáadja az access token-t
api.interceptors.request.use(
  async (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – ha 401, próbáljuk refresh-elni
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;

    const isAuthEndpoint =
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/logout");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
  
);

// ------------------- Refresh token -------------------
async function refreshToken() {
  try {
    let rToken = null;
    // Csak ha nem weben vagyunk, próbáljuk a SecureStore-t
    if (typeof window === 'undefined') { 
       const SecureStore = require("expo-secure-store");
       rToken = await SecureStore.getItemAsync('refreshToken');
    }

    const response = await api.post("/auth/refresh", 
      { token: rToken }, // Body-ban küldjük el a biztonság kedvéért
      { withCredentials: true }
    );

    accessToken = response.data.accessToken;
    setAccessToken(accessToken);
    return accessToken;
  } catch (err) {
    console.error("Refresh token hiba:", err.response?.data || err.message);

    // logout a szerver oldalon, mert refresh token lejárt
    await api.post("/auth/logout", {}, { withCredentials: true });
    accessToken = null;
    throw err;
  }
}

export { api };