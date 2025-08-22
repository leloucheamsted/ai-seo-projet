# AuthGuard - Protection des Routes

Le système AuthGuard protège toutes les routes de l'application en vérifiant l'existence d'un token d'authentification. Si aucun token n'est trouvé, l'utilisateur est automatiquement redirigé vers la page de connexion.

## 🔐 Fonctionnalités

### ✅ Protection automatique des routes
- **Vérification immédiate du token** : Contrôle la présence du token avant même de charger les composants
- **Redirection automatique** : Redirige vers `/login` si aucun token n'est trouvé
- **Support multi-stockage** : Vérifte les nouveaux et anciens emplacements de tokens
- **Sauvegarde de destination** : Mémorise la page demandée pour rediriger après connexion
- **Protection des routes publiques** : Empêche l'accès aux pages login/register si déjà connecté

## 🛡️ Types de protection

### 1. AuthGuard - Protection des routes privées
```tsx
import { AuthGuard } from '../modules/auth/components/AuthGuard';

// Protège automatiquement toute la route et ses enfants
<AuthGuard fallback="/login">
  <DashboardLayout />
</AuthGuard>
```

### 2. PublicRoute - Protection des routes publiques
```tsx
import { PublicRoute } from '../modules/auth/components/AuthGuard';

// Redirige vers dashboard si déjà connecté
<PublicRoute redirectTo="/">
  <LoginPage />
</PublicRoute>
```

### 3. ProtectedRoute - Protection flexible
```tsx
import { ProtectedRoute } from '../components/ProtectedRoute';

// Protection avec options personnalisées
<ProtectedRoute 
  fallback="/custom-login" 
  requireAuth={true}
>
  <SensitiveComponent />
</ProtectedRoute>
```

## 🔄 Flux de fonctionnement

### 1. Vérification du token
```typescript
// Vérification immédiate au niveau du AuthGuard
const hasValidToken = (): boolean => {
  // 1. Vérifier avec les nouvelles constantes
  const newToken = storage.get<string>(ACCESS_TOKEN_KEY);
  if (newToken) return true;

  // 2. Fallback pour les anciennes clés
  const legacyToken = localStorage.getItem(config.auth.tokenStorageKey) || 
                     localStorage.getItem('authToken');
  return !!legacyToken;
};
```

### 2. Redirection vers login
```typescript
// Si pas de token, redirection immédiate
if (!hasToken) {
  console.log('🚫 AuthGuard: Aucun token trouvé, redirection vers', fallback);
  return <Navigate to={fallback} state={{ from: location }} replace />;
}
```

### 3. Sauvegarde de la destination
```typescript
// Dans LoginPage, récupération de la destination
useEffect(() => {
  const from = location.state?.from?.pathname;
  if (from && from !== '/login') {
    authService.setRedirectPath(from + (location.state?.from?.search || ''));
  }
}, [location]);
```

### 4. Redirection après login
```typescript
// Après connexion réussie
const redirectPath = authService.getAndClearRedirectPath();
if (redirectPath) {
  navigate(redirectPath, { replace: true });
} else {
  navigate('/', { replace: true });
}
```

## 📋 Configuration des routes

```tsx
// src/app/routes/index.tsx
const routes: RouteObject[] = [
  // Routes publiques
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  
  // Routes protégées
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'keyword-explorer', element: <KeywordExplorerPage /> },
      // ... autres routes enfants
    ],
  },
  
  // Route catch-all (404) aussi protégée
  {
    path: '*',
    element: (
      <AuthGuard fallback="/login">
        <NotFoundPage />
      </AuthGuard>
    )
  }
];
```

## 🛠️ API du AuthGuard

### AuthGuard Props
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: string;  // Page de redirection (défaut: '/login')
}
```

### PublicRoute Props
```typescript
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;  // Page de redirection si connecté (défaut: '/')
}
```

### Services disponibles
```typescript
// Service d'authentification
authService.hasToken()                    // Vérification rapide du token
authService.setRedirectPath(path)         // Sauvegarder destination
authService.getAndClearRedirectPath()     // Récupérer et supprimer destination
authService.forceLogout(reason)           // Déconnexion forcée avec redirection

// Hook de vérification du token
const { hasToken, checkToken } = useTokenCheck();
```

## 🎯 Cas d'usage

### 1. Accès à une page protégée sans token
```
1. Utilisateur visite `/keyword-explorer`
2. AuthGuard vérifie le token ❌
3. Sauvegarde `/keyword-explorer` comme destination
4. Redirection vers `/login`
5. Après connexion ➡️ Redirection vers `/keyword-explorer`
```

### 2. Utilisateur connecté visite login
```
1. Utilisateur connecté visite `/login`
2. PublicRoute vérifie le token ✅
3. Redirection automatique vers `/` (dashboard)
```

### 3. Token expire pendant navigation
```
1. Token expire pendant l'utilisation
2. Intercepteur HTTP détecte l'erreur 401
3. Tentative de refresh du token
4. Si échec ➡️ authService.forceLogout()
5. Nettoyage et redirection vers login
```

## 🔧 Personnalisation

### Modifier la page de redirection par défaut
```tsx
// Dans AuthGuard
<AuthGuard fallback="/custom-login">
  <ProtectedComponent />
</AuthGuard>
```

### Créer un AuthGuard spécialisé
```tsx
const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

### HOC pour protection automatique
```tsx
import { withAuthGuard } from '../components/ProtectedRoute';

// Protéger automatiquement un composant
export default withAuthGuard(MyProtectedComponent, {
  fallback: '/custom-login',
  requireAuth: true
});
```

## 🚨 Gestion des erreurs

### Page non autorisée
```tsx
// UnauthorizedPage avec nettoyage automatique
<UnauthorizedPage 
  message="Votre session a expiré"
  showRetryButton={true}
/>
```

### Debug et logs
```typescript
// Activer les logs de debug dans config
dev: {
  enableDevLogs: true
}

// Les logs apparaîtront dans la console :
// 🚫 AuthGuard: Aucun token trouvé, redirection vers /login
// ✅ AuthGuard: Accès autorisé pour /dashboard
// 🔄 PublicRoute: Utilisateur déjà connecté, redirection vers /
```

## 📱 Responsive et UX

### Indicateur de chargement
```tsx
// Pendant la vérification d'authentification
<div className="min-h-screen flex items-center justify-center bg-gray-50">
  <div className="text-center">
    <Spin size="large" />
    <div className="mt-4 text-gray-600">
      Vérification de l'authentification...
    </div>
  </div>
</div>
```

### Messages d'erreur clairs
```tsx
// Page d'erreur avec actions possibles
<Result
  status="403"
  title="Accès non autorisé"
  subTitle="Vous devez être connecté pour accéder à cette page"
  extra={[
    <Button type="primary" onClick={handleLogin}>
      Se connecter
    </Button>
  ]}
/>
```

## 🧪 Tests

```tsx
describe('AuthGuard', () => {
  it('redirige vers login sans token', () => {
    storage.remove(ACCESS_TOKEN_KEY);
    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('affiche le contenu avec token valide', () => {
    storage.set(ACCESS_TOKEN_KEY, 'valid-token');
    const { getByText } = render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );
    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
```

Le AuthGuard fournit une protection robuste et transparente pour toute l'application, avec une gestion intelligente des redirections et une expérience utilisateur fluide.
