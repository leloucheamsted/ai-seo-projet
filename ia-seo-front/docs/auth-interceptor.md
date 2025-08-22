# Intercepteur d'Authentification - Guide d'utilisation

L'intercepteur d'authentification a été intégré dans tous les clients HTTP de l'application pour gérer automatiquement l'ajout du token d'authentification à toutes les requêtes.

## 📋 Fonctionnalités

### ✅ Ce qui est géré automatiquement :
- **Ajout automatique du token** : Le token d'authentification est ajouté automatiquement à toutes les requêtes
- **Gestion du `skipAuth`** : Les requêtes marquées avec `skipAuth: true` n'auront pas de token
- **Stockage centralisé** : Utilise le service de stockage et les constantes appropriées
- **Compatibilité** : Support des anciennes clés pour une migration en douceur
- **Refresh automatique** : Gestion du refresh automatique du token en cas d'expiration
- **Nettoyage automatique** : Suppression des tokens expirés et redirection vers login

## 🚀 Utilisation

### 1. Client HTTP principal (avec authentification automatique)

```typescript
import { httpClient } from '../shared/services/HttpClient';

// Cette requête utilisera automatiquement le token d'authentification
const userData = await httpClient.get('/api/users/me');
const newKeyword = await httpClient.post('/api/keywords', keywordData);
```

### 2. Requêtes sans authentification

```typescript
import { httpClient } from '../shared/services/HttpClient';

// Pour les requêtes qui ne nécessitent pas d'authentification
const response = await httpClient.post('/api/auth/login', credentials, { skipAuth: true });
const health = await httpClient.get('/api/health', { skipAuth: true });
```

### 3. Factory de clients HTTP

```typescript
import { createHttpClient, publicHttpClient } from '../shared/services/httpClientFactory';

// Client avec authentification automatique (par défaut)
const apiClient = createHttpClient();

// Client sans authentification
const response = await publicHttpClient.post('/api/auth/login', credentials);

// Client personnalisé avec configuration spécifique
const customClient = createHttpClient({
    timeout: 60000,
    customHeaders: { 'X-Service': 'Analytics' }
});
```

## 🔧 Configuration

### Constantes d'authentification

```typescript
// src/shared/constants/auth.ts
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_ID_KEY = 'user_id';
```

### Service de stockage

```typescript
import { storage } from '../shared/services/storage';

// Stockage du token
storage.set(ACCESS_TOKEN_KEY, accessToken);

// Récupération du token
const token = storage.get<string>(ACCESS_TOKEN_KEY);

// Suppression du token
storage.remove(ACCESS_TOKEN_KEY);
```

## 🔄 Flux d'authentification

### 1. Login/Register
```typescript
// Utilise skipAuth pour éviter l'ajout du token
const response = await httpClient.post('/api/auth/login', { email, password }, { skipAuth: true });

// Le token est automatiquement stocké après une connexion réussie
if (response.success) {
    storage.set(ACCESS_TOKEN_KEY, response.tokens.accessToken);
    storage.set(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
}
```

### 2. Requêtes authentifiées
```typescript
// Le token est automatiquement ajouté par l'intercepteur
const userProfile = await httpClient.get('/api/users/me');
// Headers: { "Authorization": "Bearer your-token-here" }
```

### 3. Refresh automatique du token
```typescript
// Si une requête retourne 401, l'intercepteur tente automatiquement :
// 1. Refresh du token avec le refresh token
// 2. Retry de la requête originale avec le nouveau token
// 3. Si le refresh échoue, redirection vers /login et nettoyage du stockage
```

## 📁 Structure des fichiers

```
src/
├── shared/
│   ├── services/
│   │   ├── HttpClient.ts              # Client HTTP principal avec intercepteurs
│   │   ├── httpClientFactory.ts       # Factory pour créer des clients
│   │   ├── interceptor/
│   │   │   └── auth.interceptor.ts    # Intercepteur d'authentification
│   │   └── storage.ts                 # Service de stockage centralisé
│   └── constants/
│       └── auth.ts                    # Constantes d'authentification
├── modules/
│   └── auth/
│       └── services/
│           └── authService.ts         # Service d'authentification
└── examples/
    └── auth-interceptor-usage.example.ts  # Exemples d'utilisation
```

## 🔍 Debugging

### Vérifier si le token est ajouté

```typescript
// Activer les logs de développement dans app.config.ts
dev: {
    enableDevLogs: true
}

// Les requêtes seront loggées dans la console avec les headers
```

### Vérifier le stockage du token

```typescript
import { storage } from '../shared/services/storage';
import { ACCESS_TOKEN_KEY } from '../shared/constants/auth';

console.log('Token actuel:', storage.get<string>(ACCESS_TOKEN_KEY));
```

## ⚠️ Points d'attention

1. **skipAuth obligatoire** pour login/register pour éviter les boucles infinies
2. **Constantes centralisées** : Toujours utiliser les constantes définies dans `auth.ts`
3. **Service de stockage** : Utiliser le service `storage` plutôt que `localStorage` directement
4. **Compatibilité** : Les fallbacks permettent une migration en douceur des anciennes clés
5. **Sécurité** : Les tokens sont automatiquement nettoyés en cas d'erreur d'authentification

## 🧪 Tests

```typescript
// Exemple de test pour vérifier l'intercepteur
describe('Auth Interceptor', () => {
    it('should add auth token to requests', async () => {
        storage.set(ACCESS_TOKEN_KEY, 'test-token');
        
        const response = await httpClient.get('/api/test');
        
        expect(response.config.headers.Authorization).toBe('Bearer test-token');
    });
    
    it('should skip auth when skipAuth is true', async () => {
        const response = await httpClient.get('/api/test', { skipAuth: true });
        
        expect(response.config.headers.Authorization).toBeUndefined();
    });
});
```

## 📈 Migration depuis l'ancien système

Si vous utilisez encore les anciennes clés (`authToken`, `user`), le système fonctionnera grâce aux fallbacks, mais il est recommandé de migrer vers les nouvelles constantes :

```typescript
// Ancien système (toujours supporté)
localStorage.getItem('authToken');

// Nouveau système (recommandé)
storage.get<string>(ACCESS_TOKEN_KEY);
```
