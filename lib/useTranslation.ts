// Custom hook for translations
import { useAppStore } from '@/store/useAppStore';
import { t, TranslationKey, Language } from './i18n';

export function useTranslation() {
  const language = useAppStore((s) => s.language);

  const translate = (key: TranslationKey, params?: Record<string, string | number>) => {
    return t(key, language, params);
  };

  return {
    t: translate,
    language,
  };
}

// Re-export types
export type { TranslationKey, Language };
