import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { SerpTaskGetResponse } from './interfaces/SerpTaskGetResponse';
import { SerpTaskPostParams } from './params/SerpTaskPostParams';
import { SerpTaskPostResponse } from './interfaces/SerpTaskPostResponse';

/**
 * @swagger
 * /api/rank-monitor/serp/task_post:
 *   post:
 *     summary: Create a SERP task
 *     tags:
 *       - Rank Monitor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SerpTaskPostParams'
 *     responses:
 *       200:
 *         description: SERP task post response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerpTaskPostResponse'
 */
export const serpTaskPost = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('SERP', ApiConfig.ENDPOINTS.SERP_GOOGLE_ORGANIC + '/task_post');
        const params: SerpTaskPostParams = req.body;
        if (!params.keyword) {
            return res.status(400).json({ message: 'Missing required field: keyword' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        const data = response.data as SerpTaskPostResponse;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/rank-monitor/serp/task_get/{id}:
 *   get:
 *     summary: Get SERP task by ID
 *     tags:
 *       - Rank Monitor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: SERP task get response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerpTaskGetResponse'
 */
export const serpTaskGet = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const { id } = req.params;
        const url = ApiConfig.getFullUrl('SERP', `${ApiConfig.ENDPOINTS.SERP_GOOGLE_ORGANIC}/task_get/${id}`);
        const response = await axios.get(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        const data = response.data as SerpTaskGetResponse;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
