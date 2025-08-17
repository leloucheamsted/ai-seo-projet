import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { Domain } from 'domain';
import { DomainCompetitorsResponse } from './interfaces/DomainCompetitorsResponse';
import { DomainCompetitorsParams } from './params/DomainCompetitorsParams';

/**
 * @swagger
 * /api/rank-monitor/domain-analytics/competitors:
 *   post:
 *     summary: Get domain competitors from DataForSEO Labs
 *     tags:
 *       - Rank Monitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DomainCompetitorsParams'
 *     responses:
 *       200:
 *         description: Domain competitors response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DomainCompetitorsResponse'
 */
export const domainCompetitors = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('DOMAIN_ANALYTICS', ApiConfig.ENDPOINTS.DataForSEO_KEYWORD_GOOGLE_COMPETITORS + '/live');
        const params = new DomainCompetitorsParams(req.body);
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data as DomainCompetitorsResponse);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
