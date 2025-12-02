import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. PUBLIC CLIENT
export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. PROTECTED CLIENT
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("ceylotek_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (error) {
        console.error("Error parsing user token:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // FIX 1: Check for BOTH 401 and 403
    // Your backend sends 403 for invalid tokens, so we must catch it.
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 [Interceptor] Token expired/invalid. Attempting refresh...");

        // FIX 2: Add 'withCredentials: true'
        // This is required to send the httpOnly cookie to the backend
        const { data } = await axios.get(
          `${BASE_URL}/auth/refresh`, 
          { withCredentials: true } // <--- CRITICAL FIX
        );

        console.log("✅ [Interceptor] Refresh success. New token received.");

        // Update LocalStorage
        const storedUser = localStorage.getItem("ceylotek_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.token = data.accessToken; 
          localStorage.setItem("ceylotek_user", JSON.stringify(user));
        }

        // Update header and retry
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ [Interceptor] Session expired", refreshError);
        localStorage.removeItem("ceylotek_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;