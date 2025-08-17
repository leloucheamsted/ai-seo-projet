import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { KeywordsForSiteParams } from './params/KeywordsForSiteParams';
import { KeywordsForSiteLiveResponse } from './interfaces/KeywordsForSiteLiveResponse';
import { KeywordsForSiteRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-site:
 *   post:
 *     summary: Get keyword data for site
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForSiteParams'
 *     responses:
 *       200:
 *         description: Keyword data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForSiteLiveResponse'
 */
export const keywordsForSite = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_FORSITE + '/live');
        const params = new KeywordsForSiteParams(req.body);
        if (!params.target) {
            return res.status(400).json({ message: 'target is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForSiteLiveResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await KeywordsForSiteRepository.savekeywordForSiteTask(task);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
