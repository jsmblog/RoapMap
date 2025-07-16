import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/UserContext';
import { DarkModeProvider } from './context/DarkModeContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
   <DarkModeProvider>
    <AuthProvider>
     <App />
   </AuthProvider>
   </DarkModeProvider>
);