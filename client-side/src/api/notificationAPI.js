
import axios from 'axios';

const API = 'http://localhost:3000/api';

export const getAdminNotifications = async () => {
  const res = await axios.get(`${API}/notification/admin`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const token = localStorage.getItem('token');
  return axios.put(
    `${API}/notification/${id}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
