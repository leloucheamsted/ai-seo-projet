// Types pour l'authentification
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    passwordConfirmation: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    created_at: string;
    updated_at?: string;
    hasDataForSEOCredentials?: boolean;
    isSubscribed?: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user: User;
    tokens: AuthTokens;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface AuthError {
    error: string;
    message: string;
    field?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    tokens: AuthTokens | null;
    isLoading: boolean;
    error: string | null;
}

// Types pour les formulaires
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData {
    email: string;
    password: string;
    passwordConfirmation: string;
    firstName: string;
    lastName: string;
}

// Types pour les validations
export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message: string;
}

export interface FormValidationRules {
    [key: string]: ValidationRule[];
}
