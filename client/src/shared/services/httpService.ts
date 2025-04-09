import axios from 'axios';
import { Service } from 'typedi';

@Service()
export class HttpService {
    private readonly $host;

    constructor() {
        this.$host = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
        });
    }

    get(url: string, config?: object) {
        return this.$host.get(url, config);
    }
    post(url: string, data: object, config?: object) {
        return this.$host.post(url, data, config);
    }
}
