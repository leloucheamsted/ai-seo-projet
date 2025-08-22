# Architecture Micro Front-end - IA SEO Tool

## 🏗️ **Vue d'ensemble de l'Architecture**

Cette application suit les principes de l'architecture **Micro Front-end** pour assurer :
- ✅ **Modularité** : Chaque fonctionnalité est un module indépendant
- ✅ **Scalabilité** : Ajout facile de nouveaux modules
- ✅ **Maintenabilité** : Code organisé par domaines métier
- ✅ **Performance** : Lazy loading et chargement à la demande
- ✅ **Isolation** : Modules découplés avec communication contrôlée

## 📁 **Structure des Modules**

```
src/
├── modules/                    # Modules micro front-end
│   ├── auth/                  # Module d'authentification
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts          # Point d'entrée du module
│   ├── keyword-explorer/     # Module d'exploration de mots-clés
│   ├── url-analyzer/         # Module d'analyse d'URLs
│   └── rank-monitor/         # Module de suivi de classement
│
├── shared/                    # Composants et services partagés
│   ├── components/           # Composants UI réutilisables
│   ├── services/            # Services partagés
│   ├── providers/           # Providers React
│   ├── utils/              # Utilitaires
│   └── layouts/           # Layouts partagés
│
├── config/                   # Configuration globale
│   ├── app.config.ts       # Configuration principale
│   └── microfrontend.config.ts # Configuration modules MF
│
└── app/                     # Configuration de l'application
    ├── routes/             # Routage avec lazy loading
    └── providers/         # Providers globaux
```

## ⚙️ **Configuration des Modules**

### Variables d'environnement
```env
# Activation/désactivation des modules
NODE_APP_ENABLE_KEYWORD_EXPLORER=true
NODE_APP_ENABLE_URL_ANALYZER=true
NODE_APP_ENABLE_RANK_MONITOR=true

# Configuration micro front-end
NODE_APP_MODULE_REGISTRY_ENABLED=true
NODE_APP_MODULE_LOADING_TIMEOUT=10000
NODE_APP_ENABLE_LAZY_LOADING=true
NODE_APP_PRELOAD_CRITICAL_MODULES=true
```

### Configuration TypeScript
```typescript
// config/microfrontend.config.ts
export const microFrontendConfig = {
  modules: {
    keywordExplorer: {
      name: 'Keyword Explorer',
      enabled: config.features.keywordExplorer,
      lazy: true,
      dependencies: ['react', 'antd', 'axios']
    }
    // ... autres modules
  }
};
```

## 🔄 **Communication Inter-Module**

### Service de Communication
```typescript
import { useInterModuleCommunication } from '@/shared/services/inter-module-communication.service';

function MyModule() {
  const { emit, on, showNotification } = useInterModuleCommunication('keyword-explorer');

  // Émettre un événement
  const handleSearch = (data) => {
    emit('keyword-search-completed', data);
  };

  // Écouter un événement
  useEffect(() => {
    const unsubscribe = on('user-data-updated', (event) => {
      console.log('User data updated:', event.payload);
    });
    return unsubscribe;
  }, []);

  return <div>...</div>;
}
```

### Événements Standard
- `navigate` - Navigation entre modules
- `user-data-updated` - Mise à jour des données utilisateur
- `auth-state-changed` - Changement d'état d'authentification
- `notification` - Notifications globales
- `shared-data-updated` - Données partagées

## 🚀 **Lazy Loading et Performance**

### Chargement Dynamique
```typescript
// Routes avec lazy loading
const KeywordExplorerPage = lazy(() => 
  import('@/modules/keyword-explorer/pages/KeywordExplorerPage')
);

// Wrapper avec Suspense
const withSuspense = (Component, moduleName) => {
  return (props) => (
    <Suspense fallback={<ModuleLoadingSpinner moduleName={moduleName} />}>
      <Component {...props} />
    </Suspense>
  );
};
```

### Registre des Modules
```typescript
import { MicroFrontendRegistry } from '@/shared/utils/microfrontend.utils';

// Enregistrement automatique
MicroFrontendRegistry.registerModule('keyword-explorer', 
  () => import('@/modules/keyword-explorer')
);

// Chargement à la demande
const module = await MicroFrontendRegistry.loadModule('keyword-explorer');
```

## 🛠️ **Développement de Nouveaux Modules**

### 1. Créer la structure du module
```bash
mkdir -p src/modules/my-new-module/{pages,components,services,types,hooks,utils}
```

### 2. Point d'entrée du module
```typescript
// src/modules/my-new-module/index.ts
export { default as MyNewModulePage } from './pages/MyNewModulePage';
export * from './components';
export * from './services';
export * from './types';
```

### 3. Configuration du module
```typescript
// Ajouter dans microfrontend.config.ts
modules: {
  myNewModule: {
    name: 'My New Module',
    enabled: process.env.NODE_APP_ENABLE_MY_NEW_MODULE === 'true',
    route: '/my-new-module',
    lazy: true,
    dependencies: ['react', 'antd']
  }
}
```

### 4. Enregistrement du module
```typescript
// Ajouter dans microfrontend.utils.tsx
MicroFrontendRegistry.registerModule('my-new-module', 
  () => import('@/modules/my-new-module')
);
```

### 5. Route dynamique
```typescript
// Ajouter dans routes/index.tsx
...(ModuleManager.isModuleEnabled('myNewModule') 
  ? [{ 
      path: 'my-new-module', 
      element: withSuspense(lazy(() => import('@/modules/my-new-module')), 'My New Module')({})
    }]
  : []
)
```

## 🔧 **Hooks Utiles**

### useMicroFrontend
```typescript
const { enabledModules, isModuleLoaded, loadModule, moduleStates } = useMicroFrontend();
```

### useModuleAvailability
```typescript
const { isAvailable, isEnabled, state } = useModuleAvailability('keyword-explorer');
```

### useInterModuleCommunication
```typescript
const { emit, on, once, showNotification } = useInterModuleCommunication('module-name');
```

## 📊 **Monitoring et Debug**

### Variables de debug
```env
NODE_APP_ENABLE_DEV_LOGS=true
NODE_APP_LOG_LEVEL=info
```

### Console de développement
- `📦 Module loaded: keyword-explorer`
- `📡 Event emitted: user-data-updated`
- `🚀 MicroFrontend Provider initialized`

## 🔒 **Sécurité et Bonnes Pratiques**

1. **Isolation des modules** : Chaque module a son propre contexte
2. **Communication contrôlée** : Utilisation du service IMC
3. **Feature flags** : Activation/désactivation via config
4. **Validation des dépendances** : Vérification automatique
5. **Error boundaries** : Isolation des erreurs par module

## 🚀 **Déploiement**

### Variables de production
```env
NODE_APP_ENV=production
NODE_APP_ENABLE_DEV_LOGS=false
NODE_APP_ENABLE_LAZY_LOADING=true
NODE_APP_PRELOAD_CRITICAL_MODULES=true
```

### Build optimisé
```bash
npm run build
# Les modules sont automatiquement splittés en chunks séparés
```

---

Cette architecture micro front-end garantit une application modulaire, performante et maintenable, parfaitement adaptée aux besoins d'évolution et de scalabilité du projet IA SEO Tool.
