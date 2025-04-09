import { Service } from 'typedi';
import { HttpService } from './httpService';

@Service()
export class UserService {
    constructor(private httpService: HttpService) {}

    registration = async (
        username: string,
        password: string,
        email: string,
    ) => {
        const { data } = await this.httpService.post('api/user/registration', {
            username,
            password,
            email,
        });
        return data;
    };

    login = async (email: string, password: string) => {
        const { data } = await this.httpService.post('api/user/login', {
            email,
            password,
        });
        return data;
    };

    getUser = async () => {
        const { data } = await this.httpService.get('api/user');
        return data;
    };
}
