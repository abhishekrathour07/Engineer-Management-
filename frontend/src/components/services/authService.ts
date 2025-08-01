import { api } from "./axiosRequest";


// Auth service interface
export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  role: "engineer" | "manager";
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "engineer" | "manager";
  };
}

export interface ProfileResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: "engineer" | "manager";
  };
}

export const authService = {
    
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    const { token, role, name, userId } = response.data.data;

    console.log('Login response data:', response.data.data);
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('name', name);
    localStorage.setItem('userId', userId);
    
    return response.data;
  },

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  logout(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Error during logout:', error);

    }
    window.location.href = '/login';
  },

  clearAuthData(): void {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    try {
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('name');
      const id = localStorage.getItem('userId');
      
      console.log('getCurrentUser - localStorage values:', { role, name, id });
      
      if (!role || !name || !id) {
        console.warn('Missing user data in localStorage');
        return null;
      }
      
      return { role, name, id };
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

export default api;
