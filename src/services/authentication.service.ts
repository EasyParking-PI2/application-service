import { User } from "../types/User.type";
import axios, { AxiosError } from "axios";

const verifyToken = async (token: string) => {

  if (!token) throw new Error('No token provided');

  try {
    const response = await axios.get('http://authentication-service:3000/api/auth/verify', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const user = response.data;

    return user as User;
  } catch (err: any) {
    const error = err as AxiosError;

    if (error.response) {
      const status = error.response.status;
      if (status === 401) throw new Error('Not authorized');
      if (status === 404) throw new Error('User not found');
      if (status === 500) throw new Error('Server error');
    } else {
      if(error.code === 'ECONNREFUSED') throw new Error('Authentication service is offline.');
    }

    return null;

  }
}

export { verifyToken };