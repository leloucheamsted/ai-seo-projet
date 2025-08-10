import { Request, Response } from 'express';
import { DataForSEOCredentialsRepository } from '../repositories/dataforseoCredentials.repository';

// add swagger
/**
 * @swagger
 * tags:
 *   - name: Settings
 *     description: User settings management
 */

/**
 * @swagger
 * /settings/data-for-seo-credentials:
 *   get:
 *     summary: Get SEO credentials
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: SEO credentials retrieved successfully
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: No credentials found
 */
export const getDataForSEOCredentials = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const creds = await DataForSEOCredentialsRepository.getByUserId(userId);
    if (!creds) {
        return res.status(404).json({ message: 'No credentials found' });
    }
    res.json({ login: creds.login, password: creds.password });
};

// add swagger
/**
 * @swagger
 * /settings/data-for-seo-credentials:
 *   post:
 *     summary: Set SEO credentials
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: SEO credentials updated successfully
 *       401:
 *         description: User not authenticated
 *       400:
 *         description: Invalid request
 */
export const setDataForSEOCredentials = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json({ message: 'login and password are required' });
    }
    const creds = await DataForSEOCredentialsRepository.upsertByUserId(userId, login, password);
    res.json({ login: creds.login, password: creds.password });
};
