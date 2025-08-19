import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { OnPagePostParams } from './params/OnPagePostParams';
import { OnPageTaskPostResponse } from './interfaces/OnPageTaskPostResponse';
import { OnPageTaskGetResponse } from './interfaces/OnPageTaskGetResponse';
import { OnPageTasksReadyResponse } from './interfaces/OnPageTasksReadyResponse';
import { OnPageRepository } from '../../../repositories/onPage.repository';

/**
 * @swagger
 * /api/url-analyzer/onpage/task_post:
 *   post:
 *     summary: Create an OnPage analysis task
 *     tags:
 *       - OnPage Analyzer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OnPagePostParams'
 *     responses:
 *       200:
 *         description: OnPage task post response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnPageTaskPostResponse'
 */
export const onPageTaskPost = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('ON_PAGE', '/task_post');
        const params = new OnPagePostParams(req.body);
        if (!params.target) {
            return res.status(400).json({ message: 'target is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as OnPageTaskPostResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await OnPageRepository.saveOnPageTask(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/url-analyzer/onpage/tasks_ready:
 *   post:
 *     summary: Get ready OnPage analysis tasks
 *     tags:
 *       - OnPage Analyzer
 *     responses:
 *       200:
 *         description: OnPage tasks ready response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnPageTasksReadyResponse'
 */
export const onPageTasksReady = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('ON_PAGE', '/tasks_ready');
        const response = await axios.post(url, [], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as OnPageTasksReadyResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                if (task.id) {
                    await OnPageRepository.updateOnPageTaskReady(task.id);
                }
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/url-analyzer/onpage/task_get/{id}:
 *   get:
 *     summary: Get OnPage analysis task by ID
 *     tags:
 *       - OnPage Analyzer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OnPage task get response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnPageTaskGetResponse'
 */
export const onPageTaskGet = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const { id } = req.params;
        const url = ApiConfig.getFullUrl('ON_PAGE', `/task_get/${id}`);
        const response = await axios.get(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as OnPageTaskGetResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                if (task.id && task.result) {
                    await OnPageRepository.updateOnPageTaskWithResult(task.id, task.result);
                }
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
