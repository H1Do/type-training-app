import { HttpClient } from './httpClient';
import type { User } from '../models/user';

export class UserApi {
    constructor(private httpClient: HttpClient) {}

    registration = async (
        username: string,
        password: string,
        email: string,
    ): Promise<User> => {
        const { data } = await this.httpClient.post<User>(
            'api/user/registration',
            {
                username,
                password,
                email,
            },
        );
        return data;
    };

    login = async (email: string, password: string): Promise<User> => {
        const { data } = await this.httpClient.post<User>('api/user/login', {
            email,
            password,
        });
        return data;
    };

    logout = async (): Promise<void> => {
        await this.httpClient.post('api/user/logout');
    };

    getUser = async (): Promise<User> => {
        const { data } = await this.httpClient.get<User>('api/user');
        console.log(data);
        return data;
    };
}
