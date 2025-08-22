import { logger } from './logger';
import { ApiError } from '../types/error.types';

// Types d'erreurs locaux
type ErrorType = 'NETWORK_ERROR' | 'TIMEOUT_ERROR' | 'SERVER_ERROR' | 'RATE_LIMIT_ERROR' |
    'API_LIMIT_ERROR' | 'AUTHENTICATION_ERROR' | 'PERMISSION_ERROR' |
    'VALIDATION_ERROR' | 'UNKNOWN_ERROR';

/**
 * Interface pour les statistiques d'erreurs
 */
interface ErrorStats {
    type: ErrorType;
    count: number;
    lastOccurrence: Date;
    averageResponseTime?: number;
    endpoints: Record<string, number>;
}

/**
 * Service de monitoring des erreurs
 * Collecte des statistiques sur les erreurs pour améliorer l'expérience utilisateur
 */
class ErrorMonitoringService {
    private errorStats: Map<ErrorType, ErrorStats> = new Map();
    private errorHistory: ApiError[] = [];
    private readonly maxHistorySize = 100;

    /**
     * Enregistre une erreur dans le système de monitoring
     */
    recordError(error: ApiError): void {
        try {
            // Ajouter à l'historique
            this.addToHistory(error);

            // Mettre à jour les statistiques
            this.updateStats(error);

            // Logger l'erreur avec le contexte de monitoring
            logger.error('Erreur enregistrée dans le monitoring', {
                context: 'ErrorMonitoringService',
                extra: {
                    errorType: error.errorType,
                    endpoint: error.errorDetails?.url,
                    statusCode: error.errorDetails?.status,
                    totalErrors: this.getTotalErrorCount()
                }
            });

            // Détecter les patterns d'erreurs
            this.detectErrorPatterns(error);

        } catch (monitoringError) {
            logger.warn('Erreur lors de l\'enregistrement dans le monitoring', {
                context: 'ErrorMonitoringService',
                extra: { monitoringError }
            });
        }
    }

    /**
     * Ajoute une erreur à l'historique
     */
    private addToHistory(error: ApiError): void {
        this.errorHistory.unshift(error);

        // Limiter la taille de l'historique
        if (this.errorHistory.length > this.maxHistorySize) {
            this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Met à jour les statistiques pour un type d'erreur
     */
    private updateStats(error: ApiError): void {
        const errorType = error.errorType as ErrorType;
        const existingStats = this.errorStats.get(errorType);

        if (existingStats) {
            existingStats.count++;
            existingStats.lastOccurrence = new Date();

            // Mettre à jour les endpoints
            const endpoint = error.errorDetails?.url || 'unknown';
            existingStats.endpoints[endpoint] = (existingStats.endpoints[endpoint] || 0) + 1;

        } else {
            const endpoint = error.errorDetails?.url || 'unknown';
            this.errorStats.set(errorType, {
                type: errorType,
                count: 1,
                lastOccurrence: new Date(),
                endpoints: { [endpoint]: 1 }
            });
        }
    }

    /**
     * Détecte des patterns d'erreurs préoccupants
     */
    private detectErrorPatterns(error: ApiError): void {
        const recentErrors = this.getRecentErrors(5 * 60 * 1000); // 5 minutes
        const errorType = error.errorType;

        // Détection de spike d'erreurs
        const recentErrorsOfSameType = recentErrors.filter(e => e.errorType === errorType);
        if (recentErrorsOfSameType.length >= 5) {
            logger.warn('🚨 Spike d\'erreurs détecté', {
                context: 'ErrorMonitoringService',
                extra: {
                    errorType,
                    count: recentErrorsOfSameType.length,
                    timeWindow: '5 minutes'
                }
            });
        }

        // Détection d'erreurs sur un endpoint spécifique
        const endpoint = error.errorDetails?.url;
        if (endpoint) {
            const endpointErrors = recentErrors.filter(e =>
                e.errorDetails?.url === endpoint
            );

            if (endpointErrors.length >= 3) {
                logger.warn('⚠️ Problème détecté sur un endpoint', {
                    context: 'ErrorMonitoringService',
                    extra: {
                        endpoint,
                        errorCount: endpointErrors.length,
                        errorTypes: Array.from(new Set(endpointErrors.map(e => e.errorType)))
                    }
                });
            }
        }
    }

    /**
     * Récupère les erreurs récentes selon une fenêtre de temps
     */
    private getRecentErrors(timeWindowMs: number): ApiError[] {
        const cutoff = new Date(Date.now() - timeWindowMs);
        return this.errorHistory.filter(error =>
            new Date(error.errorDetails.timestamp) > cutoff
        );
    }

    /**
     * Récupère les statistiques d'erreurs
     */
    getErrorStats(): ErrorStats[] {
        return Array.from(this.errorStats.values());
    }

    /**
     * Récupère le nombre total d'erreurs
     */
    getTotalErrorCount(): number {
        return Array.from(this.errorStats.values())
            .reduce((total, stats) => total + stats.count, 0);
    }

    /**
     * Récupère l'historique des erreurs
     */
    getErrorHistory(limit?: number): ApiError[] {
        return limit ? this.errorHistory.slice(0, limit) : [...this.errorHistory];
    }

    /**
     * Récupère les statistiques pour un type d'erreur spécifique
     */
    getStatsForErrorType(errorType: ErrorType): ErrorStats | undefined {
        return this.errorStats.get(errorType);
    }

    /**
     * Récupère les endpoints les plus problématiques
     */
    getMostProblematicEndpoints(limit = 5): Array<{ endpoint: string; errorCount: number; errorTypes: string[] }> {
        const endpointStats: Record<string, { count: number; types: Set<string> }> = {};

        // Agréger les données par endpoint
        Array.from(this.errorStats.values()).forEach(stats => {
            Object.entries(stats.endpoints).forEach(([endpoint, count]) => {
                if (!endpointStats[endpoint]) {
                    endpointStats[endpoint] = { count: 0, types: new Set() };
                }
                endpointStats[endpoint].count += count;
                endpointStats[endpoint].types.add(stats.type);
            });
        });

        // Trier par nombre d'erreurs et retourner les plus problématiques
        return Object.entries(endpointStats)
            .map(([endpoint, { count, types }]) => ({
                endpoint,
                errorCount: count,
                errorTypes: Array.from(types)
            }))
            .sort((a, b) => b.errorCount - a.errorCount)
            .slice(0, limit);
    }

    /**
     * Génère un rapport de santé de l'application
     */
    generateHealthReport(): {
        totalErrors: number;
        errorsByType: Record<string, number>;
        problematicEndpoints: Array<{ endpoint: string; errorCount: number; errorTypes: string[] }>;
        recentErrorRate: number;
        healthScore: number;
    } {
        const totalErrors = this.getTotalErrorCount();
        const recentErrors = this.getRecentErrors(60 * 60 * 1000); // 1 heure
        const recentErrorRate = recentErrors.length;

        const errorsByType = Object.fromEntries(
            Array.from(this.errorStats.entries()).map(([type, stats]) => [type, stats.count])
        );

        const problematicEndpoints = this.getMostProblematicEndpoints();

        // Calcul d'un score de santé simple (0-100)
        // Moins il y a d'erreurs récentes, meilleur est le score
        const healthScore = Math.max(0, 100 - Math.min(100, recentErrorRate * 2));

        return {
            totalErrors,
            errorsByType,
            problematicEndpoints,
            recentErrorRate,
            healthScore
        };
    }

    /**
     * Efface toutes les statistiques (utile pour les tests)
     */
    clearStats(): void {
        this.errorStats.clear();
        this.errorHistory = [];

        logger.info('Statistiques d\'erreurs effacées', {
            context: 'ErrorMonitoringService'
        });
    }

    /**
     * Exporte les données de monitoring pour analyse externe
     */
    exportData(): {
        stats: ErrorStats[];
        history: ApiError[];
        exportedAt: string;
    } {
        return {
            stats: this.getErrorStats(),
            history: this.getErrorHistory(),
            exportedAt: new Date().toISOString()
        };
    }
}

// Instance singleton du service de monitoring
export const errorMonitoring = new ErrorMonitoringService();

// Export de la classe pour les tests
export { ErrorMonitoringService };
