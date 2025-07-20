import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Preferences } from '@capacitor/preferences';
import { DarkModeContextType, DarkModeProviderProps } from '../Interfaces/iDarkMode';

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  const applyTheme = useCallback(async (mode: boolean) => {
    const method = mode ? 'add' : 'remove';
    document.body.classList[method]('dark-mode');
    await Preferences.set({ key: 'darkMode', value: String(mode) });
    setDarkMode(mode);
  }, []);


   useEffect(() => {
    const loadPreference = async () => {
      const { value } = await Preferences.get({ key: 'darkMode' });
      if (value !== null) {
        applyTheme(value === 'true');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark);
      }
    };
    loadPreference();
  }, [applyTheme]);

  
 useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = async (event: MediaQueryListEvent) => {
      const { value } = await Preferences.get({ key: 'darkMode' });
      if (value === null) {
        applyTheme(event.matches);
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [applyTheme]);

  const toggleDarkMode = () => applyTheme(!darkMode);
  const enableDarkMode = () => applyTheme(true);
  const disableDarkMode = () => applyTheme(false);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode, enableDarkMode, disableDarkMode}}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = (): DarkModeContextType => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode debe usarse dentro de un DarkModeProvider');
  }
  return context;
};
