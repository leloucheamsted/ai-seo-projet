import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { DataForSEOCredentialsService } from '../services/dataforseoCredentials.service';
import { JwtConfig } from '../config/jwt.config';
import { logger } from '../utils/logger';
import { catchAsync } from '../middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password, passwordConfirmation, firstName, lastName } = req.body;

    // Basic validation
    if (!email || !password || !passwordConfirmation || !firstName || !lastName) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Email, password, password confirmation, first name, and last name are required',
        });
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Please provide a valid email address',
        });
        return;
    }

    // Password validation
    if (password.length < 6) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Password must be at least 6 characters long',
        });
        return;
    }

    // Password confirmation validation
    if (password !== passwordConfirmation) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Password and password confirmation do not match',
        });
        return;
    }

    // Name validation
    if (firstName.length < 2 || firstName.length > 100) {
        res.status(400).json({
            error: 'Validation error',
            message: 'First name must be between 2 and 100 characters long',
        });
        return;
    }

    if (lastName.length < 2 || lastName.length > 100) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Last name must be between 2 and 100 characters long',
        });
        return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        res.status(409).json({
            error: 'User already exists',
            message: 'A user with this email already exists',
        });
        return;
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
        email,
        password_hash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
    });

    // Generate tokens
    const tokenPair = JwtConfig.generateTokenPair({
        userId: user.id,
        email: user.email,
    });

    logger.info('User registered', { userId: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            created_at: user.created_at,
        },
        tokens: tokenPair,
    });
}));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Email and password are required',
        });
        return;
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.status(401).json({
            error: 'Invalid credentials',
            message: 'Email or password is incorrect',
        });
        return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
        res.status(401).json({
            error: 'Invalid credentials',
            message: 'Email or password is incorrect',
        });
        return;
    }

    // Generate tokens
    const tokenPair = JwtConfig.generateTokenPair({
        userId: user.id,
        email: user.email,
    });

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            created_at: user.created_at,
        },
        tokens: tokenPair,
    });
}));

// add swagger
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Refresh token is required',
        });
        return;
    }

    try {
        // Verify refresh token
        const decoded = JwtConfig.verifyToken(refreshToken);

        // Find user
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            res.status(401).json({
                error: 'Invalid token',
                message: 'User not found',
            });
            return;
        }

        // Generate new tokens
        const tokenPair = JwtConfig.generateTokenPair({
            userId: user.id,
            email: user.email,
        });

        logger.info('Token refreshed', { userId: user.id });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            tokens: tokenPair,
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token',
            message: 'Refresh token is invalid or expired',
        });
    }
}));

// add swagger
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                     hasDataForSEOCredentials:
 *                       type: boolean
 *                       description: "Indicates if the user has DataForSEO credentials configured"
 *                       example: true
 *                     isSubscribed:
 *                       type: boolean
 *                       description: "Indicates if the user has an active subscription"
 *                       example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', catchAsync(async (req: Request, res: Response): Promise<void> => {
    // This route would typically use auth middleware
    // For now, we'll extract the token manually
    const token = JwtConfig.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        res.status(401).json({
            error: 'Access denied',
            message: 'No token provided',
        });
        return;
    }

    try {
        const decoded = JwtConfig.verifyToken(token);
        const user = await User.findByPk(decoded.userId);

        if (!user) {
            res.status(401).json({
                error: 'Invalid token',
                message: 'User not found',
            });
            return;
        }

        // Vérifier si l'utilisateur a des credentials DataForSEO
        const hasDataForSEOCredentials = await DataForSEOCredentialsService.hasCredentials(user.id);

        // Pour le moment, tous les utilisateurs sont considérés comme abonnés
        const isSubscribed = true;

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                created_at: user.created_at,
                updated_at: user.updated_at,
                hasDataForSEOCredentials,
                isSubscribed,
            },
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token',
            message: 'Token is invalid or expired',
        });
    }
}));

// add swagger
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful. Please remove token from client storage.
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/logout', (req: Request, res: Response): void => {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token from storage
    res.status(200).json({
        success: true,
        message: 'Logout successful. Please remove token from client storage.',
    });
});

export default router;
