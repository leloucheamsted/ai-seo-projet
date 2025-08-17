import { RelatedKeywordsRepository } from '../../../repositories/keyword.repository';
import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { RelatedKeywordsParams } from './params/RelatedKeywordsParams';
import { RelatedKeywordsResponse } from './interfaces/RelatedKeywordsResponse';

/**
 * @swagger
 * /api/keyword-explorer/related-keywords:
 *   post:
 *     summary: Get related keywords from DataForSEO Labs
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RelatedKeywordsParams'
 *     responses:
 *       200:
 *         description: Related keywords response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RelatedKeywordsResponse'
 */
export const relatedKeywords = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('DATAFORSEO_LABS', ApiConfig.ENDPOINTS.DataForSEO_KEYWORD_GOOGLE_RELATE_KEYWORDS + '/live');
        const params = new RelatedKeywordsParams(req.body);
        if (!params.keyword) {
            return res.status(400).json({ message: 'keyword is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        const responseData = response.data as RelatedKeywordsResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await RelatedKeywordsRepository.saveTask({
                    "user_id": userId,
                    ...task
                });
            }
        }
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
