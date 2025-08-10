import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface JwtPayload {
    userId: number;
    email: string;
    iat?: number;
    exp?: number;
}

export class JwtConfig {
    private static readonly SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
    private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    private static readonly REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

    /**
     * Generate access token
     */
    static generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
        const options: SignOptions = {
            expiresIn: this.EXPIRES_IN as SignOptions['expiresIn'],
            issuer: 'ia-seo-mvp',
            audience: 'ia-seo-users',
        };

        return jwt.sign(payload, this.SECRET, options);
    }

    /**
     * Generate refresh token
     */
    static generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
        const options: SignOptions = {
            expiresIn: this.REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
            issuer: 'ia-seo-mvp',
            audience: 'ia-seo-users',
        };

        return jwt.sign(payload, this.SECRET, options);
    }

    /**
     * Verify and decode token
     */
    static verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, this.SECRET, {
                issuer: 'ia-seo-mvp',
                audience: 'ia-seo-users',
            }) as JwtPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('Token expired');
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new Error('Invalid token');
            }
            throw new Error('Token verification failed');
        }
    }

    /**
     * Decode token without verification (for debugging)
     */
    static decodeToken(token: string): JwtPayload | null {
        try {
            return jwt.decode(token) as JwtPayload;
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    static isTokenExpired(token: string): boolean {
        try {
            const decoded = this.decodeToken(token);
            if (!decoded?.exp) return true;

            const now = Math.floor(Date.now() / 1000);
            return decoded.exp < now;
        } catch (error) {
            return true;
        }
    }

    /**
     * Generate token pair (access + refresh)
     */
    static generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): {
        accessToken: string;
        refreshToken: string;
    } {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload),
        };
    }

    /**
     * Extract token from Authorization header
     */
    static extractTokenFromHeader(authorization?: string): string | null {
        if (!authorization) return null;

        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

        return parts[1];
    }

    /**
     * Get token expiration time in seconds
     */
    static getExpirationTime(): number {
        const expiresIn = this.EXPIRES_IN;

        // Convert string like "7d", "24h", "60m" to seconds
        if (typeof expiresIn === 'string') {
            const unit = expiresIn.slice(-1);
            const value = parseInt(expiresIn.slice(0, -1));

            switch (unit) {
                case 'd': return value * 24 * 60 * 60;
                case 'h': return value * 60 * 60;
                case 'm': return value * 60;
                case 's': return value;
                default: return 7 * 24 * 60 * 60; // Default 7 days
            }
        }

        return typeof expiresIn === 'number' ? expiresIn : 7 * 24 * 60 * 60;
    }
}