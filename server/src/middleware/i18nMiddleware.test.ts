import { describe, it, expect, vi, beforeEach } from 'vitest';
import { i18nMiddleware } from './i18nMiddleware';
import en from '../locales/en.json';
import ru from '../locales/ru.json';

describe('i18nMiddleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = { headers: {} };
        res = {};
        next = vi.fn();
    });

    it('defaults to English when no Accept-Language header', () => {
        i18nMiddleware(req as any, res as any, next);
        expect(req.locale).toBe('en');
        const enKey = Object.keys(en)[0];
        expect(req.t(enKey)).toBe(en[enKey as keyof typeof en]);
        expect(req.t('nonexistent')).toBe('nonexistent');
        expect(next).toHaveBeenCalled();
    });

    it('uses Russian when Accept-Language is "ru"', () => {
        req.headers['accept-language'] = 'ru';
        i18nMiddleware(req as any, res as any, next);
        expect(req.locale).toBe('ru');
        const ruKey = Object.keys(ru)[0];
        expect(req.t(ruKey)).toBe(ru[ruKey as keyof typeof ru]);
        expect(req.t('nonexistent')).toBe('nonexistent');
        expect(next).toHaveBeenCalled();
    });

    it('falls back to English for unsupported locale', () => {
        req.headers['accept-language'] = 'fr';
        i18nMiddleware(req as any, res as any, next);
        expect(req.locale).toBe('fr');
        const enKey = Object.keys(en)[0];
        expect(req.t(enKey)).toBe(en[enKey as keyof typeof en]);
        expect(next).toHaveBeenCalled();
    });
});
