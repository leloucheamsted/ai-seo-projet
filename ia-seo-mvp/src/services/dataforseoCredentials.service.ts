import { DataForSEOCredentialsRepository } from '../repositories/dataforseoCredentials.repository';
import { DataForSEOCredentials } from '../models/dataforseoCredentials.model';
import { logger } from '../utils/logger';

export class DataForSEOCredentialsService {
    /**
     * Vérifie si un utilisateur a des credentials DataForSEO configurés
     * @param userId - ID de l'utilisateur
     * @returns true si l'utilisateur a des credentials, false sinon
     */
    static async hasCredentials(userId: number): Promise<boolean> {
        try {
            return await DataForSEOCredentialsRepository.hasCredentials(userId);
        } catch (error) {
            logger.error('Service error checking DataForSEO credentials', {
                userId,
                error: error instanceof Error ? error.message : error
            });
            throw new Error('Failed to check DataForSEO credentials');
        }
    }

    /**
     * Récupère les credentials DataForSEO d'un utilisateur
     * @param userId - ID de l'utilisateur
     * @returns Les credentials ou null si non trouvés
     */
    static async getCredentials(userId: number): Promise<DataForSEOCredentials | null> {
        try {
            return await DataForSEOCredentialsRepository.getByUserId(userId);
        } catch (error) {
            logger.error('Service error getting DataForSEO credentials', {
                userId,
                error: error instanceof Error ? error.message : error
            });
            throw new Error('Failed to get DataForSEO credentials');
        }
    }

    /**
     * Crée ou met à jour les credentials DataForSEO d'un utilisateur
     * @param userId - ID de l'utilisateur
     * @param login - Login DataForSEO
     * @param password - Mot de passe DataForSEO
     * @returns Les credentials créés ou mis à jour
     */
    static async saveCredentials(
        userId: number,
        login: string,
        password: string
    ): Promise<DataForSEOCredentials> {
        try {
            // Validation des données
            if (!login || !password) {
                throw new Error('Login and password are required');
            }

            if (login.length < 3) {
                throw new Error('Login must be at least 3 characters long');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            return await DataForSEOCredentialsRepository.upsertByUserId(userId, login, password);
        } catch (error) {
            logger.error('Service error saving DataForSEO credentials', {
                userId,
                login,
                error: error instanceof Error ? error.message : error
            });

            // Re-throw validation errors as-is
            if (error instanceof Error && (
                error.message.includes('required') ||
                error.message.includes('characters long')
            )) {
                throw error;
            }

            throw new Error('Failed to save DataForSEO credentials');
        }
    }

    /**
     * Teste la validité des credentials DataForSEO
     * @param login - Login DataForSEO
     * @param password - Mot de passe DataForSEO
     * @returns true si les credentials sont valides, false sinon
     */
    static async testCredentials(login: string, password: string): Promise<boolean> {
        try {
            // TODO: Implémenter l'appel réel à l'API DataForSEO pour tester les credentials
            // Pour l'instant, on simule juste la validation

            if (!login || !password) {
                return false;
            }

            // Simulation d'un test d'API
            // Dans la vraie implémentation, on ferait un appel à l'API DataForSEO
            logger.info('Testing DataForSEO credentials', { login });

            // Simulation: on considère que les credentials sont valides s'ils respectent un format basique
            const isValid = login.length >= 3 && password.length >= 6;

            return isValid;
        } catch (error) {
            logger.error('Service error testing DataForSEO credentials', {
                login,
                error: error instanceof Error ? error.message : error
            });
            return false;
        }
    }

    /**
     * Récupère le statut complet des credentials d'un utilisateur
     * @param userId - ID de l'utilisateur
     * @returns Objet avec les informations de statut
     */
    static async getCredentialsStatus(userId: number): Promise<{
        hasCredentials: boolean;
        isConfigured: boolean;
        lastUpdated?: Date;
    }> {
        try {
            const credentials = await this.getCredentials(userId);

            return {
                hasCredentials: !!credentials,
                isConfigured: !!credentials && !!credentials.login && !!credentials.password,
                lastUpdated: credentials?.updatedAt
            };
        } catch (error) {
            logger.error('Service error getting DataForSEO credentials status', {
                userId,
                error: error instanceof Error ? error.message : error
            });

            return {
                hasCredentials: false,
                isConfigured: false
            };
        }
    }
}
