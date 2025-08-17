import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { SerpAdvancedParams } from './params/SerpAdvancedParams';
import { SerpAdvancedResponse } from './interfaces/SerpAdvancedResponse';
import { SerpRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/serp-advanced:
 *   post:
 *     summary: Get advanced SERP data for keywords
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SerpAdvancedParams'
 *     responses:
 *       200:
 *         description: Advanced SERP data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerpAdvancedResponse'
 */
export const serpAdvanced = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('SERP', ApiConfig.ENDPOINTS.SERP_LIVE);
        const params = new SerpAdvancedParams(req.body);
        if (!params.keywords || !Array.isArray(params.keywords) || params.keywords.length === 0) {
            return res.status(400).json({ message: 'keywords array is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as SerpAdvancedResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await SerpRepository.saveSerpTask(task);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
