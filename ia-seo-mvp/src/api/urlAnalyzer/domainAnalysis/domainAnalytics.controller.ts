import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { DomainRankOverviewResponse } from './interfaces/DomainRankOverviewResponse';
import { DomainRankOverviewParams } from './params/DomainRankOverviewParams';

/**
 * @swagger
 * /api/url-analyzer/domain-analytics/rank-overview:
 *   post:
 *     summary: Get domain rank overview from DataForSEO Labs
 *     tags:
 *       - Domain Analytics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DomainRankOverviewParams'
 *     responses:
 *       200:
 *         description: Domain rank overview response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainRankOverviewResponse'
 */
export const domainRankOverview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('DATAFORSEO_LABS', ApiConfig.ENDPOINTS.DataForSEO_KEYWORD_GOOGLE_DOMAIN_RANK + '/live');
        const params = new DomainRankOverviewParams(req.body);

        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data as DomainRankOverviewResponse);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
