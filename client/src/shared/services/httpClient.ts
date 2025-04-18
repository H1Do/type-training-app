import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

export class HttpClient {
    private readonly $host;

    constructor() {
        this.$host = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
        });
    }

    get<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
        return this.$host.get<T>(url, config);
    }

    post<T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<AxiosResponse<T>> {
        return this.$host.post<T>(url, data, config);
    }
}
