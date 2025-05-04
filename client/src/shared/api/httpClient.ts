import axios, {
    AxiosHeaders,
    type AxiosRequestConfig,
    type AxiosResponse,
} from 'axios';
import { useSettingsStore } from '@/features/settings';
import { Localization } from '../types';

export class HttpClient {
    private readonly $host;

    constructor() {
        this.$host = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            withCredentials: true,
        });

        this.$host.interceptors.request.use((config) => {
            const settingsStore = useSettingsStore();
            const locale = settingsStore.localization || Localization.EN;

            if (!config.headers) {
                config.headers = new AxiosHeaders();
            }

            config.headers.set('Accept-Language', locale);

            return config;
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
