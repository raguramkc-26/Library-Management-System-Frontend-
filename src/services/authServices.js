import instance from "../instances/instance"

export const registerUser = async (userData) => {
    const response = await instance.post('/auth/register', userData);
    return response.data;
}

export const loginUser = async (data) => {
    const response = await instance.post('/auth/login', data);
    return response.data;
};

export const getMe = async () => {
    const response = await instance.get('/auth/getMe'); 
    return response.data;
};

export const logoutUser = async () => {
    const response = await instance.post('/auth/logout'); 
    return response.data;
};