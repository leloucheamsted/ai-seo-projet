# Module d'Authentification - Documentation

## 🔐 Vue d'ensemble

Le module d'authentification fournit une solution complète pour la gestion des utilisateurs dans l'application IA SEO. Il suit l'architecture micro front-end et utilise JWT pour l'authentification.

## 🏗️ Structure du Module

```
src/modules/auth/
├── components/          # Composants réutilisables
│   └── AuthGuard.tsx   # Gardes d'authentification
├── hooks/              # Hooks personnalisés  
│   └── useAuth.ts      # Hook principal d'authentification
├── pages/              # Pages du module
│   ├── LoginPage.tsx   # Page de connexion
│   └── RegisterPage.tsx # Page d'inscription
├── providers/          # Providers React
│   └── AuthProvider.tsx # Provider d'état global
├── services/           # Services API
│   └── authService.ts  # Service d'API d'authentification
├── types/              # Types TypeScript
│   └── auth.types.ts   # Types d'authentification
├── utils/              # Utilitaires
│   └── axiosSetup.ts   # Configuration Axios
└── index.ts            # Point d'entrée du module
```

## 🚀 Utilisation

### 1. Configuration dans App.tsx

```tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, LoginPage, RegisterPage, AuthGuard, PublicRoute, setupAxiosInterceptors } from './modules/auth';

// Configuration des intercepteurs Axios au démarrage
setupAxiosInterceptors();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Routes publiques */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          
          {/* Routes protégées */}
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <DashboardPage />
              </AuthGuard>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AuthGuard>
                <ProfilePage />
              </AuthGuard>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 2. Utilisation du Hook useAuth

```tsx
import { useAuth } from './modules/auth';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    register 
  } = useAuth();

  const handleLogin = async () => {
    const success = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    
    if (success) {
      console.log('Connexion réussie !');
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Bienvenue {user?.firstName} !</p>
          <button onClick={logout}>Se déconnecter</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Se connecter</button>
      )}
    </div>
  );
}
```

### 3. Configuration de l'API Backend

Le module est configuré pour communiquer avec l'API backend en utilisant les endpoints suivants :

```typescript
// Variables d'environnement
REACT_APP_API_BASE_URL=http://localhost:3000

// Endpoints utilisés
POST /api/auth/login
POST /api/auth/register  
POST /api/auth/refresh
GET /api/auth/me
POST /api/auth/logout
```

## 🔧 Configuration

### Variables d'environnement

```env
# URL de l'API backend
REACT_APP_API_BASE_URL=http://localhost:3000

# Optionnel: timeout pour les requêtes (ms)
REACT_APP_AUTH_TIMEOUT=10000
```

### Types d'authentification

Le module utilise les types suivants conformément au Swagger :

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  created_at: string;
  hasDataForSEOCredentials?: boolean;
  isSubscribed?: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

## 🛡️ Sécurité

### Gestion des tokens

- **Access Token** : Stocké dans localStorage, utilisé pour les requêtes API
- **Refresh Token** : Stocké dans localStorage, utilisé pour renouveler l'access token
- **Rotation automatique** : Les tokens sont automatiquement rafraîchis via les intercepteurs Axios

### Gestion des erreurs

- **401 Unauthorized** : Refresh automatique du token ou déconnexion
- **Validation côté client** : Validation des formulaires avec Ant Design
- **Messages d'erreur** : Notifications utilisateur avec Ant Design message API

### Nettoyage automatique

- Nettoyage du localStorage en cas de tokens invalides
- Redirection automatique vers la page de connexion si non authentifié
- Gestion des états incohérents

## 🔄 Intégration avec l'architecture Micro Front-end

### Communication inter-module

```typescript
// Émission d'événements d'authentification
import { useInterModuleCommunication } from '@/shared/services/inter-module-communication.service';

const { emit } = useInterModuleCommunication('auth');

// Notification des autres modules lors de la connexion
emit('auth-state-changed', { isAuthenticated: true, user });
```

### Lazy Loading

Le module peut être chargé de manière paresseuse :

```typescript
// Enregistrement du module
MicroFrontendRegistry.registerModule('auth', 
  () => import('./modules/auth')
);
```

## 🧪 Tests

### Tests unitaires

```bash
npm test src/modules/auth
```

### Tests d'intégration

Le module peut être testé avec des mocks d'API :

```typescript
import { authService } from './modules/auth';

// Mock des appels API
jest.mock('./modules/auth/services/authService');
```

## 📈 Monitoring et Logs

Le module intègre automatiquement :

- **Logs de connexion/déconnexion**
- **Métriques d'erreur d'authentification** 
- **Suivi des rafraîchissements de token**
- **Alertes en cas de problèmes de sécurité**

## 🔄 Migration et Mise à jour

### Depuis l'ancien système

Si vous migrez depuis un système d'authentification existant :

1. Remplacer les anciens hooks par `useAuth`
2. Enrober l'application avec `<AuthProvider>`
3. Remplacer les gardes de route par `<AuthGuard>` et `<PublicRoute>`
4. Configurer les intercepteurs Axios avec `setupAxiosInterceptors()`

### Compatibilité

- ✅ React 18+
- ✅ React Router v6+
- ✅ Ant Design 5.x
- ✅ Axios 1.x
- ✅ TypeScript 4.9+

---

Ce module d'authentification est entièrement intégré à l'architecture micro front-end et respecte les patterns de l'application IA SEO Tool.
