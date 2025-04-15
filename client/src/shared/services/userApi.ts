import { HttpApi } from './httpApi';
import type { User } from '../models/user';

export class UserApi {
    constructor(private httpService: HttpApi) {}

    registration = async (
        username: string,
        password: string,
        email: string,
    ): Promise<User> => {
        const { data } = await this.httpService.post<User>(
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
        const { data } = await this.httpService.post<User>('api/user/login', {
            email,
            password,
        });
        return data;
    };

    logout = async (): Promise<void> => {
        await this.httpService.post('api/user/logout');
    };

    getUser = async (): Promise<User> => {
        const { data } = await this.httpService.get<User>('api/user');
        console.log(data);
        return data;
    };
}
