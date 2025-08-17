import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { KeywordsForKeywordsResponse } from './interfaces/KeywordsForKeywordsResponse';
import { SearchVolumeParams } from './params/SearchVolumeParams';
import { KeywordsForKeywordsRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/search-volume:
 *   post:
 *     summary: Get search volume data
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchVolumeParams'
 *     responses:
 *       200:
 *         description: Search volume data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsLiveResponse'
 */
export const searchVolume = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_SEARCH_VOLUMES + '/live');
        const params = new SearchVolumeParams(req.body);
        if (!params.keywords || !Array.isArray(params.keywords) || params.keywords.length === 0) {
            return res.status(400).json({ message: 'keywords (array) is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForKeywordsResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await KeywordsForKeywordsRepository.saveTaskSearchVolume(task);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : String(error));
    }
};
