export interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export interface DarkModeProviderProps {
  children: React.ReactNode;
}
