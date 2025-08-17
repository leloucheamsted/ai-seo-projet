import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { KeywordsForKeywordsLiveParams } from './params/KeywordsForKeywordsLiveParams';
import { KeywordsForKeywordsPostParams } from './params/KeywordsForKeywordsPostParams';
import { KeywordsForKeywordsResponse } from './interfaces/KeywordsForKeywordsResponse';
import { KeywordsForKeywordsReadyResponse } from './interfaces/KeywordsForKeywordsReadyResponse';
import { KeywordsForKeywordsRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords:
 *   post:
 *     summary: Get keyword data for keywords
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForKeywordsPostParams'
 *     responses:
 *       200:
 *         description: Keyword data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsLiveResponse'
 */
export const postKeywordsForKeywords = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const params = new KeywordsForKeywordsPostParams(req.body);
        if (!params.keywords || !Array.isArray(params.keywords) || params.keywords.length === 0) {
            return res.status(400).json({ message: 'keywords (array) is required' });
        }
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_IDEAS + '/task_post');
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForKeywordsResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await KeywordsForKeywordsRepository.saveTaskPostKeywordForKeyword(task);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords:
 *   get:
 *     summary: Get keyword data for keywords
 *     tags:
 *       - Keyword Explorer
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Keyword data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsLiveResponse'
 */
export const getKeywordsForKeywords = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'id is required' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_IDEAS + `/task_get/${id}`);
        const response = await axios.get(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        res.json(response.data as KeywordsForKeywordsResponse);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords:
 *   post:
 *     summary: Get keyword data for keywords
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForKeywordsPostParams'
 *     responses:
 *       200:
 *         description: Keyword data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsLiveResponse'
 */
export const readyKeywordsForKeywords = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'id is required' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_IDEAS + `/task_ready/${id}`);
        const response = await axios.get(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForKeywordsReadyResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await KeywordsForKeywordsRepository.updateTaskKeywordForKeyword(task.id);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords:
 *   post:
 *     summary: Get keyword data for keywords
 *     tags:
 *       - Keyword Explorer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForKeywordsPostParams'
 *     responses:
 *       200:
 *         description: Keyword data response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsLiveResponse'
 */
export const liveKeywordsForKeywords = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const params = new KeywordsForKeywordsLiveParams(req.body);
        if (!params.keywords || !Array.isArray(params.keywords) || params.keywords.length === 0) {
            return res.status(400).json({ message: 'keywords (array) is required' });
        }
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_IDEAS + '/live');
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForKeywordsResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await KeywordsForKeywordsRepository.saveTaskLiveKeywordForKeyword(task);
            }
        }

        res.json(responseData as KeywordsForKeywordsResponse);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

