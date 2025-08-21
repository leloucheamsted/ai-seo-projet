# Migration: Ajout du champ user_id

Cette migration ajoute le champ `user_id` à toutes les tables nécessaires de la base de données IA SEO.

## Tables concernées

### Tables principales (déjà mises à jour dans les modèles):
- `serp_tasks`
- `keywords_for_keywords_tasks`
- `keywords_for_site_tasks`
- `onpage_tasks`
- `domain_rank_overview_tasks`
- `content_analysis_summary_tasks`
- `domain_competitors_tasks`
- `related_keywords_tasks`
- `task_costs`

### Tables du schéma initial (si elles existent):
- `url_audits`
- `keyword_searches`
- `rank_monitor`
- `rank_alerts`

## Caractéristiques de la migration

✅ **Sécurisée** : Utilise des transactions pour garantir la cohérence
✅ **Intelligente** : Vérifie l'existence des tables et colonnes avant modification
✅ **Performance** : Ajoute automatiquement des index sur les clés étrangères
✅ **Réversible** : Inclut la méthode `down` pour annuler la migration

## Utilisation

### Exécuter la migration
```bash
# Méthode recommandée avec notre script personnalisé
npm run db:migrate:user-id

# Ou directement avec ts-node
ts-node src/scripts/migrate-user-id.ts
```

### Structure du champ user_id ajouté

```sql
user_id INTEGER NOT NULL DEFAULT 1 
REFERENCES users(id) 
ON UPDATE CASCADE 
ON DELETE CASCADE
```

**Note** : La valeur par défaut `1` est temporaire pour les enregistrements existants. En production, vous devriez :
1. Exécuter la migration
2. Mettre à jour les enregistrements existants avec les bons `user_id`
3. Supprimer la valeur par défaut si nécessaire

## Vérification post-migration

Après avoir exécuté la migration, vous pouvez vérifier que les colonnes ont été ajoutées :

```sql
-- Vérifier la structure d'une table
\d serp_tasks

-- Vérifier les contraintes de clés étrangères
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND kcu.column_name = 'user_id';
```

## Rollback

Si nécessaire, vous pouvez annuler cette migration (⚠️ **ATTENTION** : cela supprimera définitivement les colonnes user_id) :

```javascript
// Exécuter manuellement dans un script Node.js
const migration = require('./migrations/20250821000000-add-user-id-to-all-tables.js');
await migration.down(sequelize.getQueryInterface(), Sequelize);
```

## Intégration avec l'application

Cette migration prépare la base de données pour les fonctionnalités de groupement par utilisateur dans l'API. Elle est nécessaire pour :

- 🔐 Isolation des données par utilisateur
- 📊 APIs de groupement (Groups endpoints)
- 🚀 Fonctionnalités multi-tenant

## Troubleshooting

### Erreur : "Table does not exist"
```
Table [nom_table] does not exist, skipping...
```
**Solution** : Normal, la migration ignore automatiquement les tables inexistantes.

### Erreur : "Column already exists"
```
Table [nom_table] already has user_id column, skipping...
```
**Solution** : Normal, la migration détecte et ignore les colonnes déjà existantes.

### Erreur de clé étrangère
**Solution** : Assurez-vous que la table `users` existe avant d'exécuter cette migration.
