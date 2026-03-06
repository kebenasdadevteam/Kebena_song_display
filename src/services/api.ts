const API_URL = 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

// Helper function for API calls
async function apiCall(endpoint: string, options: any = {}) {
  const headers: any = {
    ...options.headers
  };
  
  // Add auth token if not skipped
  const token = getAuthToken();
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (multipart)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error: any) {
    // Check if it's a network error (backend not running)
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      // Create a custom error that's less alarming - the app will fall back to sample data
      const backendError = new Error('Backend server not available - using offline mode');
      backendError.name = 'BackendConnectionError';
      throw backendError;
    }
    throw error;
  }
}

// Auth API
export const authAPI = {
  async login(username: string, password: string) {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true
    });
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
  
  async getProfile() {
    return await apiCall('/auth/me');
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return await apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },

  async getAllUsers() {
    return await apiCall('/auth/users');
  },

  async createUser(userData: { username: string; password: string; fullName: string; role: string; email?: string }) {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async updateUser(userId: number, updates: { fullName?: string; role?: string; email?: string; isActive?: boolean }) {
    return await apiCall(`/auth/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteUser(userId: number) {
    return await apiCall(`/auth/users/${userId}`, {
      method: 'DELETE'
    });
  },

  async resetUserPassword(userId: number, newPassword: string) {
    return await apiCall(`/auth/users/${userId}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword })
    });
  }
};

// Song API
export const songAPI = {
  async getAllSongs(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return await apiCall(`/songs${query ? '?' + query : ''}`);
  },
  
  async getSongById(id: number) {
    return await apiCall(`/songs/${id}`);
  },
  
  async createSong(songData: any) {
    return await apiCall('/songs', {
      method: 'POST',
      body: JSON.stringify(songData)
    });
  },
  
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    
    try {
      const response = await fetch(`${API_URL}/songs/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }
      
      return data;
    } catch (error: any) {
      // Check if it's a network error (backend not running)
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running at http://localhost:5000');
      }
      throw error;
    }
  },

  async uploadBackgroundImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();

    try {
      const response = await fetch(`${API_URL}/songs/background-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Background image upload failed');
      }

      return data;
    } catch (error: any) {
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to backend server. Please ensure the backend is running at http://localhost:5000');
      }
      throw error;
    }
  },
  
  async createFromFile(songData: any) {
    return await apiCall('/songs/from-file', {
      method: 'POST',
      body: JSON.stringify(songData)
    });
  },
  
  async updateSong(id: number, updates: any) {
    return await apiCall(`/songs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  
  async deleteSong(id: number) {
    return await apiCall(`/songs/${id}`, {
      method: 'DELETE'
    });
  },

  async getStats() {
    return await apiCall('/songs/stats');
  },

  async scanUploads() {
    return await apiCall('/songs/scan-uploads');
  },

  async processUploadFile(filename: string) {
    return await apiCall('/songs/process-upload', {
      method: 'POST',
      body: JSON.stringify({ filename })
    });
  }
};

// Settings API
export const settingsAPI = {
  async getSettings() {
    return await apiCall('/settings');
  },
  
  async updateSetting(key: string, value: string) {
    return await apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify({ key, value })
    });
  }
};

export default {
  auth: authAPI,
  songs: songAPI,
  settings: settingsAPI
};