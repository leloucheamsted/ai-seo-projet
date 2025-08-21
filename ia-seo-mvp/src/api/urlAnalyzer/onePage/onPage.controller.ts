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
 *     description: |
 *       Creates a new OnPage analysis task for comprehensive website audit. 
 *       This endpoint allows you to configure detailed crawling parameters including:
 *       - Crawl depth and page limits
 *       - Browser settings and JavaScript execution
 *       - Content parsing and validation options
 *       - Custom robots.txt and sitemap handling
 *       - Advanced checks and thresholds configuration
 *       
 *       The task will analyze technical SEO aspects, page structure, content quality, 
 *       and provide detailed metrics for optimization.
 *     tags:
 *       - OnPage Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           example: application/json
 *         description: Must be application/json
 *       - in: header
 *         name: User-Agent
 *         schema:
 *           type: string
 *           example: IA-SEO-App/1.0
 *         description: Custom user agent identifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OnPagePostParams'
 *           examples:
 *             basic_analysis:
 *               summary: Basic OnPage analysis
 *               description: Simple website audit with minimal configuration
 *               value:
 *                 target: "https://example.com"
 *                 max_crawl_pages: 100
 *                 enable_content_parsing: true
 *                 validate_micromarkup: true
 *                 tag: "basic-audit"
 *             comprehensive_analysis:
 *               summary: Comprehensive OnPage analysis
 *               description: Full website audit with JavaScript rendering and advanced checks
 *               value:
 *                 target: "https://example.com"
 *                 max_crawl_pages: 500
 *                 max_crawl_depth: 5
 *                 enable_javascript: true
 *                 enable_browser_rendering: true
 *                 load_resources: true
 *                 enable_content_parsing: true
 *                 validate_micromarkup: true
 *                 calculate_keyword_density: true
 *                 check_spell: true
 *                 check_spell_language: "en"
 *                 respect_sitemap: true
 *                 allow_subdomains: false
 *                 crawl_delay: 1
 *                 browser_preset: "desktop"
 *                 tag: "comprehensive-audit"
 *             mobile_analysis:
 *               summary: Mobile-focused OnPage analysis
 *               description: Website audit optimized for mobile experience
 *               value:
 *                 target: "https://example.com"
 *                 max_crawl_pages: 200
 *                 browser_preset: "mobile"
 *                 browser_screen_width: 375
 *                 browser_screen_height: 667
 *                 enable_javascript: true
 *                 load_resources: true
 *                 enable_content_parsing: true
 *                 custom_user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
 *                 tag: "mobile-audit"
 *     responses:
 *       200:
 *         description: OnPage task successfully created
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in current time window
 *             schema:
 *               type: integer
 *           X-Response-Time:
 *             description: Response time in milliseconds
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnPageTaskPostResponse'
 *             examples:
 *               task_created:
 *                 summary: Task creation success
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-01-15T10:30:00.000Z"
 *                   cost: 0.1
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20100
 *                       status_message: "Task Created."
 *                       time: "2024-01-15T10:30:00.000Z"
 *                       cost: 0.1
 *                       result_count: 0
 *                       path: ["v3", "on_page", "task_post"]
 *                       data:
 *                         api: "on_page"
 *                         function: "task_post"
 *                         target: "https://example.com"
 *                         max_crawl_pages: 100
 *                       result: null
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "target is required"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *             examples:
 *               missing_target:
 *                 summary: Missing target URL
 *                 value:
 *                   message: "target is required"
 *               invalid_url:
 *                 summary: Invalid target URL format
 *                 value:
 *                   message: "Invalid URL format"
 *                   errors:
 *                     - field: "target"
 *                       message: "Must be a valid URL starting with http or https"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Insufficient permissions or quota exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "API quota exceeded"
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Too many requests"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "DataForSEO API connection failed"
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
                await OnPageRepository.saveOnPageTask(task, params, userId);
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
 *     description: |
 *       Retrieves a list of OnPage analysis tasks that have completed processing 
 *       and are ready for result retrieval. This endpoint helps monitor task 
 *       completion status and provides metadata about finished analyses.
 *       
 *       Use this endpoint to:
 *       - Check which OnPage tasks have completed
 *       - Get task IDs for result retrieval
 *       - Monitor processing status
 *       - Plan result collection workflow
 *     tags:
 *       - OnPage Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           example: application/json
 *         description: Must be application/json
 *       - in: header
 *         name: User-Agent
 *         schema:
 *           type: string
 *           example: IA-SEO-App/1.0
 *         description: Custom user agent identifier
 *     responses:
 *       200:
 *         description: List of ready OnPage analysis tasks
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in current time window
 *             schema:
 *               type: integer
 *           X-Response-Time:
 *             description: Response time in milliseconds
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnPageTasksReadyResponse'
 *             examples:
 *               tasks_ready:
 *                 summary: Ready tasks found
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-01-15T10:45:00.000Z"
 *                   cost: 0.001
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "ready_check_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-01-15T10:45:00.000Z"
 *                       cost: 0.001
 *                       result_count: 2
 *                       path: ["v3", "on_page", "tasks_ready"]
 *                       data:
 *                         api: "on_page"
 *                         function: "tasks_ready"
 *                       result:
 *                         - id: "task_12345678-1234-1234-1234-123456789012"
 *                           target: "https://example.com"
 *                           date_posted: "2024-01-15T10:30:00.000Z"
 *                           tag: "comprehensive-audit"
 *                         - id: "task_87654321-4321-4321-4321-210987654321"
 *                           target: "https://test-site.com"
 *                           date_posted: "2024-01-15T10:35:00.000Z"
 *                           tag: "mobile-audit"
 *               no_tasks_ready:
 *                 summary: No ready tasks
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-01-15T10:45:00.000Z"
 *                   cost: 0.001
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "ready_check_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-01-15T10:45:00.000Z"
 *                       cost: 0.001
 *                       result_count: 0
 *                       path: ["v3", "on_page", "tasks_ready"]
 *                       data:
 *                         api: "on_page"
 *                         function: "tasks_ready"
 *                       result: []
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access denied"
 *       429:
 *         description: Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Too many requests"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch ready tasks"
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
