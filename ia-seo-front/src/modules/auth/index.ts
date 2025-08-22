// Point d'entrée du module Auth
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';

// Components
export { AuthGuard, PublicRoute } from './components/AuthGuard';

// Services
export { authService } from './services/authService';

// Hooks
export { useAuth } from './hooks/useAuth';

// Providers
export { AuthProvider, useAuthContext } from './providers/AuthProvider';

// Utils
export { setupAxiosInterceptors } from './utils/axiosSetup';

// Types
export * from './types/auth.types';
