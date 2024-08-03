import { User } from "../types/User.type";

const verifyToken = async (token: string) => {

  if (!token) throw new Error('No token provided');

  try {

    const request = await fetch('http://localhost:3000/api/auth/verify', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if(request.status === 401) throw new Error('Not authorized');
    if(request.status === 404) throw new Error('User not found');
    if(request.status === 500) throw new Error('Server error');

    const user = await request.json();

    return user as User;
  }catch(err){
    return null;
  }

}

export { verifyToken };