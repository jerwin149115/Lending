const API_URL = `http://localhost:3000`

export const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/register/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
};

export const login = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/login/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
};