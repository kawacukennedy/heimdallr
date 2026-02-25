import en, { Translation } from './en';
import es from './es';
import fr from './fr';
import de from './de';
import zh from './zh';

const translations: Record<string, Translation> = { en, es, fr, de, zh };

export const SUPPORTED_LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'zh', label: '中文' },
] as const;

export function getTranslation(lang: string): Translation {
    return translations[lang] || translations.en;
}

export function t(key: string, lang: string = 'en', params: Record<string, any> = {}): string {
    const trans = getTranslation(lang);
    const keys = key.split('.');
    let value: any = trans;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) return key;
    }

    if (typeof value !== 'string') return key;

    // Replace {param} placeholders
    return value.replace(/\{(\w+)\}/g, (_, p) => {
        return params[p] !== undefined ? String(params[p]) : `{${p}}`;
    });
}

export type { Translation };
