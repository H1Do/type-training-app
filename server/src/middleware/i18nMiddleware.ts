import { NextFunction, Request, Response } from 'express';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import { Localization } from '@/types/locales';

const translate = (locale: Localization, key: string): string => {
    const translations: { [key: string]: any } = {
        en,
        ru,
    };

    const selectedLocalization = translations[locale] || translations.en;
    return selectedLocalization[key] || key;
};

export const i18nMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const locale = (
        req.headers['accept-language'] ?? Localization.EN
    ).toLowerCase() as Localization;

    req.locale = locale;
    req.t = (key: string) => translate(locale, key);
    next();
};
