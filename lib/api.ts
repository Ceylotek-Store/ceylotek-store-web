import axios from 'axios';

// --- 1. DYNAMIC BASE URL STRATEGY ---
// This function decides which URL to use based on where the code is running.
const getBaseUrl = () => {
  if (typeof window === "undefined") {
    // 🖥️ SERVER-SIDE (Docker Container)
    // We must talk directly to the API container via the Docker network
    return "http://ceylotek-api:5000/api";
  }
  // 🌐 CLIENT-SIDE (Browser)
  // We talk to the public URL (usually http://localhost/api via Nginx)
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost/api";
};

// 1. PUBLIC CLIENT (No Interceptors)
export const publicApi = axios.create({
  baseURL: getBaseUrl(), // <--- Uses the dynamic function
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. PROTECTED CLIENT (With Interceptors)
const api = axios.create({
  baseURL: getBaseUrl(), // <--- Uses the dynamic function
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    // ⚠️ SAFETY CHECK: Only access localStorage in the browser
    if (typeof window !== 'undefined') {
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
    }
    
    // Ensure the baseURL is correct for every request (just in case)
    config.baseURL = getBaseUrl();
    
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401/403 and ensure we haven't retried already
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // ⚠️ SAFETY CHECK: We can only auto-refresh efficiently in the browser
      if (typeof window === 'undefined') {
        return Promise.reject(error);
      }

      try {
        console.log("🔄 [Interceptor] Token expired/invalid. Attempting refresh...");

        // Use the public URL for refresh since this happens in the browser
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost/api"}/auth/refresh`, 
          { withCredentials: true }
        );

        console.log("✅ [Interceptor] Refresh success. New token received.");

        // Update LocalStorage
        const storedUser = localStorage.getItem("ceylotek_user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.token = data.accessToken; 
          localStorage.setItem("ceylotek_user", JSON.stringify(user));
        }

        // Update header and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
        
        // Ensure retry uses the correct dynamic baseURL
        originalRequest.baseURL = getBaseUrl();
        
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