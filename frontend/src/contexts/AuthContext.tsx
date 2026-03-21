import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Adjust to your Django server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Check your login function to see what you named the token in localStorage. 
    // Usually it's 'access' or 'accessToken' or 'token'.
    const token = localStorage.getItem('access_token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, // If the request succeeds, just return it
  async (error) => {
    const originalRequest = error.config;

    // If Django returns a 401 Unauthorized, and we haven't already retried this request...
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark it so we don't get stuck in an infinite loop

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        
        // Ask Django for a new access token
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refreshToken
        });

        // Save the new token
        const newAccessToken = response.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Update the failed request's header with the new token and retry it
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // If the refresh token is ALSO expired, force the user to log in again
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

interface User {
  user_id: string;
  username: string;
  email: string;
  role: string;
  tenant_name: string;
  // Add other fields you might include in your JWT payload (e.g., tenant_id)
}

interface AuthContextType {
  user: any;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  loading: boolean;
}

// 3. Initialize the Context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check for existing token on initial load
  useEffect(() => {
    const checkUserStatus = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const decoded = jwtDecode<User>(token);
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if ((decoded as any).exp < currentTime) {
            logout();
          } else {
            setUser(decoded);
            // Attach token to all future Axios requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkUserStatus();
  }, []);

  const register = async (userData: any) => {
    await api.post('register/', userData);
    navigate('/login');
  };

  const login = async (identifier: string, password: string) => {
    // Assuming you are using djangorestframework-simplejwt endpoints
    const response = await api.post('token/', 
      {
        username: identifier,
        password: password
      });

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    
    const decodedUser = jwtDecode<User>(response.data.access);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Create the Custom Hook (the one you used in your LoginPage)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default api; // Export the configured axios instance for use in other components