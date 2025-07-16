import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { Preferences } from '@capacitor/preferences';
import { DarkModeContextType, DarkModeProviderProps } from '../Interfaces/iDarkMode';

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const loadPreference = async () => {
      const { value } = await Preferences.get({ key: 'darkMode' });

      if (value !== null) {
        setDarkMode(value === 'true');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
      }
    };

    loadPreference();
  }, []);

  useEffect(() => {
    const updateTheme = async () => {
      const classMethod = darkMode ? 'add' : 'remove';
      document.body.classList[classMethod]('dark-mode');
      await Preferences.set({ key: 'darkMode', value: String(darkMode) });
    };

    updateTheme();
  }, [darkMode]);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = async (event: MediaQueryListEvent) => {
      const { value } = await Preferences.get({ key: 'darkMode' });
      if (value === null) {
        setDarkMode(event.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
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
