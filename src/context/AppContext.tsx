import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { initDatabase, SeedProgress } from '../db/database';
import { Language } from '../db/types';
import { getStrings, Strings } from '../i18n/strings';

type AppContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Strings;
  isRtl: boolean;
  ready: boolean;
  seedProgress: SeedProgress | null;
  herbCount: number;
  error: string | null;
  retryInit: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);
const LANG_KEY = 'harbs_language';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [ready, setReady] = useState(false);
  const [seedProgress, setSeedProgress] = useState<SeedProgress | null>(null);
  const [herbCount, setHerbCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [bootKey, setBootKey] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(LANG_KEY).then((value) => {
      if (value === 'en' || value === 'ur') setLanguageState(value);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError(null);
        setReady(false);
        const result = await initDatabase((progress) => {
          if (!cancelled) setSeedProgress(progress);
        });
        if (!cancelled) {
          setHerbCount(result.count);
          setReady(true);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Database failed to open');
          setReady(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bootKey]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANG_KEY, lang).catch(() => undefined);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      setLanguage,
      t: getStrings(language),
      isRtl: language === 'ur',
      ready,
      seedProgress,
      herbCount,
      error,
      retryInit: () => setBootKey((k) => k + 1),
    }),
    [language, setLanguage, ready, seedProgress, herbCount, error],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
