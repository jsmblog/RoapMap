import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/UserContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { LanguageProvider } from "./context/LanguageContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <LanguageProvider>
    <DarkModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DarkModeProvider>
  </LanguageProvider>
);
