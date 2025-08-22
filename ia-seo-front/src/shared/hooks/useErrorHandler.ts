import { useState, useCallback } from 'react';

interface UseErrorHandlerReturn {
    isLoading: boolean;
    error: Error | null;
    handleError: (error: unknown) => void;
    clearError: () => void;
    retry: (fn: () => Promise<void>, maxAttempts?: number) => Promise<void>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleError = useCallback((error: unknown) => {
        let processedError: Error;
        let errorMessage: string;

        if (error instanceof Error) {
            processedError = error;
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            processedError = new Error(error);
            errorMessage = error;
        } else if (error && typeof error === 'object' && 'errorDetails' in error) {
            // C'est probablement une ApiError
            const apiError = error as any;
            errorMessage = apiError.errorDetails?.message || 'Erreur API';
            processedError = new Error(errorMessage);
        } else {
            processedError = new Error('Une erreur inconnue s\'est produite');
            errorMessage = 'Une erreur inconnue s\'est produite';
        }

        setError(processedError);

        // Afficher la notification d'erreur
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const retry = useCallback(async (
        fn: () => Promise<void>,
        maxAttempts: number = 3
    ): Promise<void> => {
        let attempts = 0;
        setIsLoading(true);
        clearError();

        while (attempts < maxAttempts) {
            try {
                await fn();
                setIsLoading(false);
                return;
            } catch (error) {
                attempts++;

                if (attempts === maxAttempts) {
                    handleError(error);
                    setIsLoading(false);
                    throw error;
                }

                // Attendre avant de réessayer (backoff exponentiel)
                const delay = Math.pow(2, attempts) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }, [handleError, clearError]);

    return {
        isLoading,
        error,
        handleError,
        clearError,
        retry
    };
};
