import { Localization } from '../locales';

declare global {
    namespace Express {
        interface Request {
            locale: Localization;
            t: (key: string) => string;
        }
    }
}
