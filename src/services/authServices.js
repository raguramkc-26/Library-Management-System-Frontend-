import instance from "../instances/instance"

export const registerUser = (userData) => instance.post('/auth/register', userData);

export const loginUser = (data) => instance.post('/auth/login', data);

export const getMe = () => instance.get('/auth/me'); 

export const logoutUser = () => instance.post('/auth/logout'); 