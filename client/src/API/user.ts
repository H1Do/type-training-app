import { $host } from '.';

export const registration = async (
    username: string,
    password: string,
    email: string,
) => {
    const { data } = await $host.post('api/user/registration', {
        username,
        password,
        email,
    });
    return data;
};

export const login = async (email: string, password: string) => {
    const { data } = await $host.post('api/user/login', {
        email,
        password,
    });
    return data;
};

export const getUser = async () => {
    const { data } = await $host.get('api/user');
    return data;
};
