import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { I18nManager } from 'react-native';
import type { SupportedLanguageCode } from '@core/constants';

// Locale files
import en from '@l10n/en.json';
import hi from '@l10n/hi.json';
import gu from '@l10n/gu.json';
import es from '@l10n/es.json';
import fr from '@l10n/fr.json';
import de from '@l10n/de.json';
import pt from '@l10n/pt.json';
import ar from '@l10n/ar.json';
import id from '@l10n/id.json';
import bn from '@l10n/bn.json';
import mr from '@l10n/mr.json';
import ta from '@l10n/ta.json';
import te from '@l10n/te.json';
import kn from '@l10n/kn.json';
import ml from '@l10n/ml.json';

export const resources = { en, hi, gu, es, fr, de, pt, ar, id, bn, mr, ta, te, kn, ml } as const;

export const SUPPORTED_LANG_CODES: SupportedLanguageCode[] = [
  'en', 'hi', 'gu', 'es', 'fr', 'de', 'pt', 'ar', 'id', 'bn', 'mr', 'ta', 'te', 'kn', 'ml',
];

export function getSystemLanguage(): SupportedLanguageCode {
  const locales = getLocales();
  const primary = locales[0];
  if (!primary) return 'en';
  const tag = primary.languageTag.split('-')[0] ?? '';
  if (SUPPORTED_LANG_CODES.includes(tag as SupportedLanguageCode)) {
    return tag as SupportedLanguageCode;
  }
  return 'en';
}

export function isRTLLanguage(code: string): boolean {
  return code === 'ar';
}

export function applyRTL(code: string): void {
  const shouldBeRTL = isRTLLanguage(code);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    // Note: after calling forceRTL, app typically needs to reload.
    // The caller is responsible for triggering this reload.
  }
}

export async function initI18n(savedLanguage?: string): Promise<void> {
  const lng = (savedLanguage ?? getSystemLanguage()) as SupportedLanguageCode;

  await i18n.use(initReactI18next).init({
    resources: Object.fromEntries(
      Object.entries(resources).map(([code, translations]) => [code, { translation: translations }])
    ),
    lng,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });
}

export default i18n;
