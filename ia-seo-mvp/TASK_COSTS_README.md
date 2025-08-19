# Système de Suivi des Coûts des Tâches DataForSEO

Ce système permet de suivre automatiquement les coûts de toutes les tâches DataForSEO exécutées par les utilisateurs.

## Composants

### 1. Modèle TaskCost (`taskCost.model.ts`)
- Enregistre les coûts des tâches avec association aux utilisateurs
- Champs principaux:
  - `user_id`: ID de l'utilisateur
  - `task_id`: ID de la tâche DataForSEO
  - `task_type`: Type de tâche (keywords_for_keywords, serp, etc.)
  - `cost`: Coût de la tâche
  - `api_endpoint`: Endpoint API utilisé
  - `status_code`: Code de statut de la tâche
  - `created_at`: Date d'enregistrement

### 2. Service TaskCostService (`taskCost.service.ts`)
Services pour:
- Enregistrer les coûts des tâches
- Extraire les coûts depuis les réponses DataForSEO
- Calculer les totaux par utilisateur
- Obtenir les coûts par type de tâche

### 3. Middleware TaskCost (`taskCost.middleware.ts`)
Intercepte automatiquement les réponses pour enregistrer les coûts:
```typescript
import { taskCostMiddleware, TaskTypes } from '../middlewares/taskCost.middleware';

// Utilisation dans une route
router.post('/keywords-for-keywords', 
    authMiddleware,
    taskCostMiddleware(TaskTypes.KEYWORDS_FOR_KEYWORDS),
    keywordsForKeywordsController
);
```

### 4. Contrôleur TaskCosts (`taskCosts.controller.ts`)
API pour consulter les coûts:
- `GET /api/task-costs/user-total` - Total des coûts utilisateur
- `GET /api/task-costs/user-by-type` - Coûts par type de tâche

## Utilisation

### Intégration Automatique avec Middleware
```typescript
// Dans une route
app.use('/api/keyword-explorer/keywords-for-keywords', 
    authMiddleware,
    taskCostMiddleware(TaskTypes.KEYWORDS_FOR_KEYWORDS),
    keywordsRoutes
);
```

### Enregistrement Manuel
```typescript
import { TaskCostService } from '../services/taskCost.service';

// Après une réponse DataForSEO
const costs = TaskCostService.extractTaskCosts(
    responseData,
    userId,
    '/api/keywords-for-keywords',
    'keywords_for_keywords'
);

await TaskCostService.recordMultipleTaskCosts(costs);
```

### Consultation des Coûts
```typescript
// Total des coûts d'un utilisateur
const totalCost = await TaskCostService.getUserTotalCost(userId);

// Coûts par type de tâche
const costsByType = await TaskCostService.getUserCostsByTaskType(userId);
```

## Types de Tâches Supportés
- `KEYWORDS_FOR_KEYWORDS`: Recherche de mots-clés
- `KEYWORDS_FOR_SITE`: Mots-clés pour un site
- `RELATED_KEYWORDS`: Mots-clés associés
- `SEARCH_VOLUME`: Volume de recherche
- `SERP`: Résultats de recherche
- `ONPAGE`: Analyse OnPage
- `CONTENT_ANALYSIS`: Analyse de contenu
- `DOMAIN_ANALYTICS`: Analytics de domaine
- `DOMAIN_COMPETITORS`: Concurrents de domaine

## API Endpoints

### GET /api/task-costs/user-total
Récupère le total des coûts pour l'utilisateur connecté.

Paramètres optionnels:
- `startDate`: Date de début (format ISO)
- `endDate`: Date de fin (format ISO)

### GET /api/task-costs/user-by-type
Récupère les coûts groupés par type de tâche pour l'utilisateur connecté.

## Installation

1. Exécuter la migration:
```bash
npx sequelize-cli db:migrate
```

2. Importer le modèle dans `models/index.ts`

3. Ajouter les routes dans `app.ts`:
```typescript
import taskCostsRoutes from './api/taskCosts/taskCosts.routes';
app.use('/api/task-costs', taskCostsRoutes);
```

4. Utiliser le middleware dans les routes qui appellent DataForSEO
