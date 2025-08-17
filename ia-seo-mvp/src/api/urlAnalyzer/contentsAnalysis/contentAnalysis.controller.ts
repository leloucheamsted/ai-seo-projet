import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { ContentAnalysisSummaryLiveParams } from './params/ContentAnalysisSummaryLiveParams';
import { ContentAnalysisSummaryLiveResponse } from './interfaces/ContentAnalysisSummaryLiveResponse';

/**
 * @swagger
 * /api/url-analyzer/content-analysis/summary-live:
 *   post:
 *     summary: Get content analysis summary (live)
 *     tags:
 *       - Content Analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentAnalysisSummaryLiveParams'
 *     responses:
 *       200:
 *         description: Content analysis summary response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContentAnalysisSummaryLiveResponse'
 */
export const contentAnalysisSummaryLive = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('CONTENT_ANALYSIS', ApiConfig.ENDPOINTS.CONTENT_SENTIMENT + '/live');
        const params = new ContentAnalysisSummaryLiveParams(req.body);
        if (!params.keyword) {
            return res.status(400).json({ message: 'keywords is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data as ContentAnalysisSummaryLiveResponse);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
