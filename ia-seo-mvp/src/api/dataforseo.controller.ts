import { Router, Request, Response } from 'express';
import { DataForSEOCredentialsService } from '../services/dataforseoCredentials.service';
import { JwtConfig } from '../config/jwt.config';
import { logger } from '../utils/logger';
import { catchAsync } from '../middlewares/error.middleware';

const router = Router();

/**
 * @swagger
 * /api/dataforseo/credentials:
 *   get:
 *     summary: Get DataForSEO credentials status
 *     tags: [DataForSEO]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Credentials status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasCredentials:
 *                       type: boolean
 *                       description: "Indicates if user has credentials"
 *                       example: true
 *                     isConfigured:
 *                       type: boolean
 *                       description: "Indicates if credentials are properly configured"
 *                       example: true
 *                     lastUpdated:
 *                       type: string
 *                       format: date-time
 *                       description: "Last update date"
 *       401:
 *         description: Unauthorized
 */
router.get('/credentials', catchAsync(async (req: Request, res: Response): Promise<void> => {
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
        const credentialsStatus = await DataForSEOCredentialsService.getCredentialsStatus(decoded.userId);

        res.status(200).json({
            success: true,
            data: credentialsStatus,
        });
    } catch (error) {
        res.status(401).json({
            error: 'Invalid token',
            message: 'Token is invalid or expired',
        });
    }
}));

/**
 * @swagger
 * /api/dataforseo/credentials:
 *   post:
 *     summary: Save or update DataForSEO credentials
 *     tags: [DataForSEO]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: "DataForSEO login"
 *                 example: "your_login"
 *               password:
 *                 type: string
 *                 description: "DataForSEO password"
 *                 example: "your_password"
 *     responses:
 *       200:
 *         description: Credentials saved successfully
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
 *                   example: "Credentials saved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasCredentials:
 *                       type: boolean
 *                       example: true
 *                     isConfigured:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/credentials', catchAsync(async (req: Request, res: Response): Promise<void> => {
    const token = JwtConfig.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        res.status(401).json({
            error: 'Access denied',
            message: 'No token provided',
        });
        return;
    }

    const { login, password } = req.body;

    if (!login || !password) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Login and password are required',
        });
        return;
    }

    try {
        const decoded = JwtConfig.verifyToken(token);

        // Sauvegarder les credentials
        await DataForSEOCredentialsService.saveCredentials(decoded.userId, login, password);

        // Récupérer le statut mis à jour
        const credentialsStatus = await DataForSEOCredentialsService.getCredentialsStatus(decoded.userId);

        logger.info('DataForSEO credentials saved', {
            userId: decoded.userId,
            login: login.substring(0, 3) + '***' // Log partiel pour sécurité
        });

        res.status(200).json({
            success: true,
            message: 'Credentials saved successfully',
            data: credentialsStatus,
        });
    } catch (error) {
        if (error instanceof Error) {
            // Si c'est une erreur de validation, on retourne 400
            if (error.message.includes('required') || error.message.includes('characters long')) {
                res.status(400).json({
                    error: 'Validation error',
                    message: error.message,
                });
                return;
            }
        }

        logger.error('Error saving DataForSEO credentials', {
            error: error instanceof Error ? error.message : error
        });

        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to save credentials',
        });
    }
}));

/**
 * @swagger
 * /api/dataforseo/credentials/test:
 *   post:
 *     summary: Test DataForSEO credentials
 *     tags: [DataForSEO]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - password
 *             properties:
 *               login:
 *                 type: string
 *                 description: "DataForSEO login to test"
 *               password:
 *                 type: string
 *                 description: "DataForSEO password to test"
 *     responses:
 *       200:
 *         description: Test completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 isValid:
 *                   type: boolean
 *                   description: "Indicates if credentials are valid"
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Credentials are valid"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/credentials/test', catchAsync(async (req: Request, res: Response): Promise<void> => {
    const token = JwtConfig.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
        res.status(401).json({
            error: 'Access denied',
            message: 'No token provided',
        });
        return;
    }

    const { login, password } = req.body;

    if (!login || !password) {
        res.status(400).json({
            error: 'Validation error',
            message: 'Login and password are required for testing',
        });
        return;
    }

    try {
        const decoded = JwtConfig.verifyToken(token);
        const isValid = await DataForSEOCredentialsService.testCredentials(login, password);

        logger.info('DataForSEO credentials tested', {
            userId: decoded.userId,
            login: login.substring(0, 3) + '***',
            isValid
        });

        res.status(200).json({
            success: true,
            isValid,
            message: isValid ? 'Credentials are valid' : 'Credentials are invalid',
        });
    } catch (error) {
        logger.error('Error testing DataForSEO credentials', {
            error: error instanceof Error ? error.message : error
        });

        res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to test credentials',
        });
    }
}));

export default router;
