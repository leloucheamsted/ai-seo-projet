# Modèles TypeScript pour IA SEO MVP

Ce dossier contient tous les modèles TypeScript utilisant Sequelize pour votre backend Node.js d'analyse SEO.

## Structure des Modèles

### 1. User Model (`user.model.ts`)
Gère les utilisateurs de l'application.
- **Attributs**: id, email, password_hash, created_at, updated_at
- **Relations**: hasMany avec tous les autres modèles

### 2. Keyword Models (`keyword.model.ts`)
Gère les recherches de mots-clés et leurs métriques.
- **KeywordSearch**: Historique des recherches
- **Keyword**: Métriques détaillées des mots-clés (volume, CPC, difficulté, etc.)

### 3. URL Audit Models (`urlAudit.model.ts`)
Gère les audits d'URL et leurs résultats.
- **UrlAudit**: Demandes d'audit
- **UrlAuditTechnical**: Résultats techniques (Core Web Vitals, erreurs)
- **UrlAuditContent**: Analyse de contenu (score sémantique, entités manquantes)

### 4. Rank Monitor Models (`rankMonitor.model.ts`)
Gère le suivi des positions et alertes.
- **DomainVisibility**: Visibilité globale des domaines
- **RankMonitor**: Suivi des positions des mots-clés
- **RankAlert**: Alertes sur les variations de position

### 5. API Usage Model (`apiUsage.model.ts`)
Gère les quotas et limitations d'API.
- **ApiUsage**: Suivi de l'utilisation des APIs avec méthodes utilitaires

### 6. Alert Model (`alert.model.ts`)
Système d'alertes génériques pour toutes les notifications.

## Installation et Configuration

### 1. Variables d'environnement
Copiez `.env.example` vers `.env` et configurez vos variables :

```bash
cp .env.example .env
```

### 2. Installation des dépendances
```bash
npm install
```

### 3. Initialisation de la base de données
```bash
# Créer les tables
npm run db:init

# Forcer la recréation des tables (supprime les données existantes)
npm run db:init:force

# Supprimer toutes les tables
npm run db:drop

# Reset complet (drop + recréation)
npm run db:reset
```

## Utilisation des Modèles

### Import des modèles
```typescript
import {
  User,
  KeywordSearch,
  Keyword,
  UrlAudit,
  RankMonitor,
  ApiUsage,
  Alert
} from './models';
```

### Exemples d'utilisation

#### Créer un utilisateur
```typescript
const user = await User.create({
  email: 'user@example.com',
  password_hash: 'hashed_password'
});
```

#### Créer une recherche de mots-clés
```typescript
const search = await KeywordSearch.create({
  user_id: user.id,
  keyword: 'seo tools'
});

// Ajouter des métriques
const keyword = await Keyword.create({
  keyword_search_id: search.id,
  keyword_text: 'best seo tools',
  search_volume: 5000,
  cpc: 2.50,
  keyword_difficulty: 65.5,
  search_intent: 'commercial'
});
```

#### Créer un audit d'URL
```typescript
const audit = await UrlAudit.create({
  user_id: user.id,
  url: 'https://example.com',
  status: 'pending'
});

// Ajouter les résultats techniques
const technicalResults = await UrlAuditTechnical.create({
  url_audit_id: audit.id,
  core_web_vitals: {
    lcp: 2.5,
    fid: 50,
    cls: 0.1
  },
  score: 85.5
});
```

#### Suivi des positions
```typescript
const rankMonitor = await RankMonitor.create({
  user_id: user.id,
  domain: 'example.com',
  keyword: 'seo tools',
  current_position: 3,
  tracked_date: new Date()
});
```

#### Gestion des quotas API
```typescript
const apiUsage = await ApiUsage.create({
  user_id: user.id,
  api_name: 'keyword_explorer',
  usage_count: 1,
  quota_limit: 1000
});

// Incrémenter l'utilisation
apiUsage.incrementUsage();
await apiUsage.save();

// Vérifier le quota
if (apiUsage.isQuotaExceeded()) {
  throw new Error('Quota exceeded');
}
```

#### Système d'alertes
```typescript
const alert = await Alert.create({
  user_id: user.id,
  type: 'rank_change',
  title: 'Position améliorée',
  message: 'Votre site a gagné 2 positions pour "seo tools"',
  priority: 'medium'
});
```

### Requêtes avec relations
```typescript
// Utilisateur avec toutes ses données
const userWithData = await User.findByPk(userId, {
  include: [
    {
      association: 'keywordSearches',
      include: ['keywords']
    },
    {
      association: 'urlAudits',
      include: ['technicalResults', 'contentResults']
    },
    'rankMonitors',
    'apiUsages',
    'alerts'
  ]
});

// Alertes en attente
const pendingAlerts = await Alert.findAll({
  where: {
    user_id: userId,
    status: 'pending'
  },
  order: [['priority', 'DESC']]
});
```

## Associations

Les modèles sont liés entre eux via des associations Sequelize :

- **User** → hasMany → KeywordSearch, UrlAudit, RankMonitor, ApiUsage, Alert
- **KeywordSearch** → hasMany → Keyword
- **UrlAudit** → hasOne → UrlAuditTechnical, UrlAuditContent
- **RankMonitor** → hasMany → RankAlert

## Scripts Disponibles

- `npm run dev` : Démarre le serveur en mode développement
- `npm run dev:watch` : Démarre avec rechargement automatique
- `npm run build` : Compile TypeScript vers JavaScript
- `npm run start` : Démarre le serveur compilé
- `npm run db:init` : Initialise la base de données
- `npm run db:init:force` : Force la recréation des tables
- `npm run db:drop` : Supprime toutes les tables
- `npm run db:reset` : Reset complet de la base

## Types TypeScript

Tous les modèles incluent des interfaces TypeScript strictes :

- `UserAttributes` & `UserCreationAttributes`
- `KeywordSearchAttributes` & `KeywordSearchCreationAttributes`
- `UrlAuditAttributes` & `UrlAuditCreationAttributes`
- etc.

Ces types garantissent la sécurité des types lors du développement et une meilleure expérience de développement avec l'autocomplétion.

## Bonnes Pratiques

1. **Toujours utiliser les types TypeScript** pour éviter les erreurs
2. **Utiliser les transactions** pour les opérations complexes
3. **Gérer les erreurs** de base de données appropriément
4. **Utiliser les associations** plutôt que des jointures manuelles
5. **Valider les données** avant l'insertion en base

## Support

Pour plus d'informations sur Sequelize, consultez la [documentation officielle](https://sequelize.org/).
