export interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  enableDarkMode: () => void;
  disableDarkMode: () => void;
}

export interface DarkModeProviderProps {
  children: React.ReactNode;
}
