# Installation et Configuration de Swagger

## 📦 Installation des dépendances

Pour installer Swagger sur votre backend IA SEO MVP, suivez ces étapes :

### 1. Installer les packages npm

```bash
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express
```

### 2. Vérifier le package.json

Assurez-vous que votre `package.json` contient ces dépendances :

```json
{
  "dependencies": {
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "@types/swagger-jsdoc": "^6.0.4",
    "@types/swagger-ui-express": "^4.1.6"
  }
}
```

## 🚀 Démarrage rapide

### 1. Installer toutes les dépendances

```bash
npm install
```

### 2. Démarrer le serveur

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm start
```

### 3. Accéder à la documentation

Une fois le serveur démarré, vous pouvez accéder à :

- **Documentation Swagger UI** : `http://localhost:3000/api/docs`
- **Spécification JSON** : `http://localhost:3000/api/docs.json`
- **API Info** : `http://localhost:3000/api`
- **Health Check** : `http://localhost:3000/health`

## 📖 Utilisation de Swagger

### Interface Swagger UI

L'interface Swagger UI vous permet de :

1. **Explorer toutes les routes API** avec leurs paramètres
2. **Tester directement les endpoints** depuis l'interface
3. **Voir les schémas de données** (modèles)
4. **S'authentifier** avec JWT pour tester les routes protégées

### Authentification dans Swagger

1. Allez sur `/api/docs`
2. Utilisez l'endpoint `POST /api/auth/login` pour vous connecter
3. Copiez le `accessToken` de la réponse
4. Cliquez sur "Authorize" en haut de la page
5. Entrez `Bearer YOUR_TOKEN` (remplacez YOUR_TOKEN par le token)
6. Maintenant vous pouvez tester les routes protégées

## 🔧 Configuration

### Fichiers de configuration

- **`src/config/swagger.config.ts`** : Configuration principale de Swagger
- **`src/app.ts`** : Intégration de Swagger dans Express
- **Annotations dans les contrôleurs** : Documentation des routes

### Personnalisation

Vous pouvez personnaliser :

1. **Titre et description** dans `swagger.config.ts`
2. **Schémas de données** pour vos modèles
3. **Tags** pour organiser les endpoints
4. **Sécurité** (JWT, API keys, etc.)

### Ajouter de nouveaux endpoints

Pour documenter une nouvelle route, ajoutez des annotations JSDoc :

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   post:
 *     summary: Description de votre endpoint
 *     tags: [YourTag]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/YourSchema'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourResponseSchema'
 */
router.post('/your-endpoint', async (req, res) => {
  // Votre code ici
});
```

## 📋 Endpoints documentés

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/refresh` - Renouvellement du token
- `GET /api/auth/me` - Profil utilisateur actuel

### À venir
- **Keyword Explorer** - Recherche et analyse de mots-clés
- **URL Analyzer** - Audit de pages et domaines
- **Rank Monitor** - Suivi des positions

## 🛠 Développement

### Ajouter de nouveaux schémas

1. Ouvrez `src/config/swagger.config.ts`
2. Ajoutez votre schéma dans `components.schemas`
3. Référencez-le dans vos annotations avec `$ref: '#/components/schemas/YourSchema'`

### Organiser avec des tags

Utilisez les tags pour grouper vos endpoints :

```typescript
tags: [
  {
    name: 'Authentication',
    description: 'User authentication and authorization'
  },
  {
    name: 'Keyword Explorer',
    description: 'Keyword research and analysis'
  }
]
```

## 🚨 Notes importantes

1. **Sécurité** : La documentation expose la structure de votre API. En production, vous pourriez vouloir protéger l'accès avec un middleware d'authentification.

2. **Performance** : Swagger UI charge toute la documentation côté client. Pour de très grandes APIs, considérez une approche modulaire.

3. **Maintenance** : Gardez vos annotations à jour avec votre code pour éviter une documentation obsolète.

## 🔗 Ressources utiles

- [Swagger/OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express Documentation](https://github.com/scottie1984/swagger-ui-express)
- [OpenAPI 3.0 Guide](https://swagger.io/docs/specification/about/)

## 🐛 Dépannage

### Erreur "Cannot find module"
```bash
npm install swagger-jsdoc swagger-ui-express
npm install --save-dev @types/swagger-jsdoc @types/swagger-ui-express
```

### Documentation vide
Vérifiez que vos annotations JSDoc sont dans les fichiers listés dans `swagger.config.ts` dans la section `apis`.

### Problèmes d'authentification
Assurez-vous que votre token JWT est valide et non expiré. Utilisez le format `Bearer YOUR_TOKEN` dans l'autorisation.
