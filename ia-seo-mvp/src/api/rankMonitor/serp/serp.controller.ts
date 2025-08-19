import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { SerpTaskGetResponse } from './interfaces/SerpTaskGetResponse';
import { SerpTaskPostParams } from './params/SerpTaskPostParams';
import { SerpTaskPostResponse } from './interfaces/SerpTaskPostResponse';
import { SerpTaskReadyResponse } from './interfaces/SerpTaskReadyResponse';
import { SerpTaskRepository } from '../../../repositories/rankMonitor.repository';

/**
 * @swagger
 * /api/rank-monitor/serp/task_post:
 *   post:
 *     summary: Create a SERP analysis task
 *     description: Create a new SERP (Search Engine Results Page) analysis task for keyword ranking tracking. This endpoint queues a task for analyzing search results for a specific keyword and location.
 *     tags:
 *       - Rank Monitor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SerpTaskPostParams'
 *           examples:
 *             basic_task:
 *               summary: Basic SERP task
 *               description: Create a basic SERP analysis task for a keyword
 *               value:
 *                 keyword: "SEO tools"
 *                 location_name: "United States"
 *                 language_name: "English"
 *                 device: "desktop"
 *                 depth: 100
 *             advanced_task:
 *               summary: Advanced SERP task with options
 *               description: Create an advanced SERP task with specific parameters
 *               value:
 *                 keyword: "best SEO software 2024"
 *                 url: "https://mywebsite.com"
 *                 location_code: 2840
 *                 language_code: "en"
 *                 device: "mobile"
 *                 os: "android"
 *                 depth: 200
 *                 priority: 2
 *                 group_organic_results: true
 *                 people_also_ask_click_depth: 2
 *                 tag: "competitor-analysis"
 *             mobile_task:
 *               summary: Mobile SERP analysis
 *               description: Create a SERP task specifically for mobile device analysis
 *               value:
 *                 keyword: "local SEO services"
 *                 location_name: "New York"
 *                 language_name: "English"
 *                 device: "mobile"
 *                 os: "ios"
 *                 browser_screen_width: 375
 *                 browser_screen_height: 667
 *                 calculate_rectangles: true
 *     responses:
 *       200:
 *         description: SERP task created successfully
 *         headers:
 *           X-RateLimit-Limit:
 *             description: The number of allowed requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: The number of remaining requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: The time at which the current rate limit window resets
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The content type of the response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerpTaskPostResponse'
 *             examples:
 *               successful_task_creation:
 *                 summary: Successful SERP task creation
 *                 description: Example of a successfully created SERP task
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:30:00.000Z"
 *                   cost: 0.003
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20100
 *                       status_message: "Task Created."
 *                       time: "2024-03-15T10:30:00.000Z"
 *                       cost: 0.003
 *                       result_count: 0
 *                       path: ["v3", "serp", "google", "organic", "task_post"]
 *                       data:
 *                         api: "serp"
 *                         function: "task_post"
 *                         se: "google"
 *                         se_type: "organic"
 *                         language_code: "en"
 *                         location_code: 2840
 *                         keyword: "SEO tools"
 *                         device: "desktop"
 *                         tag: "serp-analysis"
 *                       result: null
 *       400:
 *         description: Bad request - Invalid parameters
 *         headers:
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_keyword:
 *                 summary: Missing required keyword
 *                 description: Error when keyword parameter is not provided
 *                 value:
 *                   error: "Missing required field: keyword"
 *                   code: "MISSING_KEYWORD"
 *                   details: "The keyword parameter is required for SERP analysis"
 *               invalid_depth:
 *                 summary: Invalid depth parameter
 *                 description: Error when depth parameter is out of range
 *                 value:
 *                   error: "Invalid depth parameter"
 *                   code: "INVALID_DEPTH"
 *                   details: "Depth must be between 1 and 700"
 *               invalid_device:
 *                 summary: Invalid device parameter
 *                 description: Error when device parameter is not supported
 *                 value:
 *                   error: "Invalid device parameter"
 *                   code: "INVALID_DEVICE"
 *                   details: "Device must be either 'desktop' or 'mobile'"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *         headers:
 *           WWW-Authenticate:
 *             description: Authentication method required
 *             schema:
 *               type: string
 *               example: Bearer
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_token:
 *                 summary: Missing authentication token
 *                 description: Error when no authentication token is provided
 *                 value:
 *                   error: "Unauthorized"
 *                   code: "MISSING_AUTH"
 *                   details: "Authentication token is required"
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *         headers:
 *           X-RateLimit-Limit:
 *             description: The number of allowed requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: The number of remaining requests in the current period
 *             schema:
 *               type: integer
 *               example: 0
 *           X-RateLimit-Reset:
 *             description: The time at which the current rate limit window resets
 *             schema:
 *               type: integer
 *           Retry-After:
 *             description: The time to wait before making another request
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rate_limit_exceeded:
 *                 summary: Rate limit exceeded
 *                 description: Error when API rate limit is exceeded
 *                 value:
 *                   error: "Rate limit exceeded"
 *                   code: "RATE_LIMIT_EXCEEDED"
 *                   details: "API rate limit exceeded. Please retry after the specified time."
 *       500:
 *         description: Internal Server Error - Server-side error occurred
 *         headers:
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 description: Error when an unexpected server error occurs
 *                 value:
 *                   error: "Internal server error occurred while creating SERP task"
 *                   code: "INTERNAL_ERROR"
 *                   details: "An unexpected error occurred. Please try again later."
 *               api_error:
 *                 summary: External API error
 *                 description: Error when DataForSEO API returns an error
 *                 value:
 *                   error: "DataForSEO API error"
 *                   code: "EXTERNAL_API_ERROR"
 *                   details: "The external API returned an error. Please check your parameters and try again."
 *       503:
 *         description: Service Unavailable - External service temporarily unavailable
 *         headers:
 *           Retry-After:
 *             description: The time to wait before retrying the request
 *             schema:
 *               type: integer
 *               example: 300
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               service_unavailable:
 *                 summary: External service unavailable
 *                 description: Error when DataForSEO service is temporarily unavailable
 *                 value:
 *                   error: "DataForSEO service temporarily unavailable"
 *                   code: "SERVICE_UNAVAILABLE"
 *                   details: "The DataForSEO service is temporarily unavailable. Please try again later."
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

        if (data.tasks && Array.isArray(data.tasks)) {
            for (const task of data.tasks) {
                await SerpTaskRepository.saveSerpTaskPost(task, params);
            }
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/rank-monitor/serp/task_get/{id}:
 *   get:
 *     summary: Get SERP task results by ID
 *     description: Retrieve the results of a completed SERP analysis task using its unique task ID. This endpoint returns detailed SERP data including organic results, paid ads, and other search features.
 *     tags:
 *       - Rank Monitor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique task ID returned from the task_post endpoint
 *         schema:
 *           type: string
 *           pattern: '^task_[a-f0-9-]{36}$'
 *           example: 'task_12345678-1234-1234-1234-123456789012'
 *       - in: query
 *         name: format
 *         required: false
 *         description: Response format type
 *         schema:
 *           type: string
 *           enum: ['regular', 'advanced', 'html']
 *           default: 'regular'
 *           example: 'regular'
 *     responses:
 *       200:
 *         description: SERP task results retrieved successfully
 *         headers:
 *           X-RateLimit-Limit:
 *             description: The number of allowed requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: The number of remaining requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: The time at which the current rate limit window resets
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The content type of the response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerpTaskGetResponse'
 *             examples:
 *               successful_task_results:
 *                 summary: Successful SERP task results
 *                 description: Example of successfully retrieved SERP task results
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:35:00.000Z"
 *                   cost: 0.003
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-03-15T10:35:00.000Z"
 *                       cost: 0.003
 *                       result_count: 1
 *                       path: ["v3", "serp", "google", "organic", "task_get"]
 *                       data:
 *                         api: "serp"
 *                         function: "task_get"
 *                         se: "google"
 *                         se_type: "organic"
 *                         language_code: "en"
 *                         location_code: 2840
 *                         keyword: "SEO tools"
 *                         device: "desktop"
 *                       result:
 *                         - keyword: "SEO tools"
 *                           type: "organic"
 *                           se_domain: "google.com"
 *                           location_code: 2840
 *                           language_code: "en"
 *                           check_url: "https://www.google.com/search?q=SEO+tools"
 *                           datetime: "2024-03-15T10:35:00.000Z"
 *                           spell: null
 *                           item_types: ["organic", "paid", "people_also_ask"]
 *                           se_results_count: 2450000
 *                           items_count: 100
 *                           items: []
 *       400:
 *         description: Bad request - Invalid task ID format
 *         headers:
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_task_id:
 *                 summary: Invalid task ID format
 *                 description: Error when task ID format is invalid
 *                 value:
 *                   error: "Invalid task ID format"
 *                   code: "INVALID_TASK_ID"
 *                   details: "Task ID must follow the format: task_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *         headers:
 *           WWW-Authenticate:
 *             description: Authentication method required
 *             schema:
 *               type: string
 *               example: Bearer
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_token:
 *                 summary: Missing authentication token
 *                 description: Error when no authentication token is provided
 *                 value:
 *                   error: "Unauthorized"
 *                   code: "MISSING_AUTH"
 *                   details: "Authentication token is required"
 *       404:
 *         description: Task not found
 *         headers:
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               task_not_found:
 *                 summary: Task not found
 *                 description: Error when the specified task ID doesn't exist
 *                 value:
 *                   error: "Task not found"
 *                   code: "TASK_NOT_FOUND"
 *                   details: "No task found with the specified ID"
 *               task_not_ready:
 *                 summary: Task not ready
 *                 description: Error when the task is not yet completed
 *                 value:
 *                   error: "Task not ready"
 *                   code: "TASK_NOT_READY"
 *                   details: "The task is still processing. Please check tasks_ready endpoint first."
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *         headers:
 *           X-RateLimit-Limit:
 *             description: The number of allowed requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: The number of remaining requests in the current period
 *             schema:
 *               type: integer
 *               example: 0
 *           X-RateLimit-Reset:
 *             description: The time at which the current rate limit window resets
 *             schema:
 *               type: integer
 *           Retry-After:
 *             description: The time to wait before making another request
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rate_limit_exceeded:
 *                 summary: Rate limit exceeded
 *                 description: Error when API rate limit is exceeded
 *                 value:
 *                   error: "Rate limit exceeded"
 *                   code: "RATE_LIMIT_EXCEEDED"
 *                   details: "API rate limit exceeded. Please retry after the specified time."
 *       500:
 *         description: Internal Server Error - Server-side error occurred
 *         headers:
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 description: Error when an unexpected server error occurs
 *                 value:
 *                   error: "Internal server error occurred while retrieving SERP task results"
 *                   code: "INTERNAL_ERROR"
 *                   details: "An unexpected error occurred. Please try again later."
 *       503:
 *         description: Service Unavailable - External service temporarily unavailable
 *         headers:
 *           Retry-After:
 *             description: The time to wait before retrying the request
 *             schema:
 *               type: integer
 *               example: 300
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               service_unavailable:
 *                 summary: External service unavailable
 *                 description: Error when DataForSEO service is temporarily unavailable
 *                 value:
 *                   error: "DataForSEO service temporarily unavailable"
 *                   code: "SERVICE_UNAVAILABLE"
 *                   details: "The DataForSEO service is temporarily unavailable. Please try again later."
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

        // Mettre à jour la tâche dans la base de données
        if (data.tasks && Array.isArray(data.tasks)) {
            for (const task of data.tasks) {
                await SerpTaskRepository.updateSerpTaskReady(task);
            }
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/rank-monitor/serp/tasks_ready:
 *   get:
 *     summary: Get list of ready SERP tasks
 *     description: Retrieve a list of SERP analysis tasks that have been completed and are ready for result retrieval. Use this endpoint to check which tasks can be fetched using the task_get endpoint.
 *     tags:
 *       - Rank Monitor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of ready tasks to return
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *           example: 50
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Offset for pagination of ready tasks
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 0
 *     responses:
 *       200:
 *         description: Ready SERP tasks retrieved successfully
 *         headers:
 *           X-RateLimit-Limit:
 *             description: The number of allowed requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: The number of remaining requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: The time at which the current rate limit window resets
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The content type of the response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SerpTaskReadyResponse'
 *             examples:
 *               successful_ready_tasks:
 *                 summary: Successful ready tasks retrieval
 *                 description: Example of successfully retrieved ready SERP tasks
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:40:00.000Z"
 *                   cost: 0.001
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-03-15T10:40:00.000Z"
 *                       cost: 0.001
 *                       result_count: 2
 *                       path: ["v3", "serp", "google", "organic", "tasks_ready"]
 *                       data:
 *                         api: "serp"
 *                         function: "tasks_ready"
 *                         se: "google"
 *                       result:
 *                         - id: "task_12345678-1234-1234-1234-123456789012"
 *                           se: "google"
 *                           se_type: "organic"
 *                           date_posted: "2024-03-15T10:30:00.000Z"
 *                           tag: "serp-analysis"
 *                           endpoint_regular: "/v3/serp/google/organic/task_get/regular/task_12345678-1234-1234-1234-123456789012"
 *                           endpoint_advanced: "/v3/serp/google/organic/task_get/advanced/task_12345678-1234-1234-1234-123456789012"
 *                           endpoint_html: "/v3/serp/google/organic/task_get/html/task_12345678-1234-1234-1234-123456789012"
 *                         - id: "task_87654321-4321-4321-4321-210987654321"
 *                           se: "google"
 *                           se_type: "organic"
 *                           date_posted: "2024-03-15T10:32:00.000Z"
 *                           tag: "competitor-analysis"
 *                           endpoint_regular: "/v3/serp/google/organic/task_get/regular/task_87654321-4321-4321-4321-210987654321"
 *                           endpoint_advanced: null
 *                           endpoint_html: null
 *               no_ready_tasks:
 *                 summary: No ready tasks available
 *                 description: Example when no SERP tasks are ready for retrieval
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:40:00.000Z"
 *                   cost: 0.001
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "ready_check_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-03-15T10:40:00.000Z"
 *                       cost: 0.001
 *                       result_count: 0
 *                       path: ["v3", "serp", "google", "organic", "tasks_ready"]
 *                       data:
 *                         api: "serp"
 *                         function: "tasks_ready"
 *                         se: "google"
 *                       result: []
 *       401:
 *         description: Unauthorized - Invalid or missing authentication
 *         headers:
 *           WWW-Authenticate:
 *             description: Authentication method required
 *             schema:
 *               type: string
 *               example: Bearer
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missing_token:
 *                 summary: Missing authentication token
 *                 description: Error when no authentication token is provided
 *                 value:
 *                   error: "Unauthorized"
 *                   code: "MISSING_AUTH"
 *                   details: "Authentication token is required"
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *         headers:
 *           X-RateLimit-Limit:
 *             description: The number of allowed requests in the current period
 *             schema:
 *               type: integer
 *           X-RateLimit-Remaining:
 *             description: The number of remaining requests in the current period
 *             schema:
 *               type: integer
 *               example: 0
 *           X-RateLimit-Reset:
 *             description: The time at which the current rate limit window resets
 *             schema:
 *               type: integer
 *           Retry-After:
 *             description: The time to wait before making another request
 *             schema:
 *               type: integer
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rate_limit_exceeded:
 *                 summary: Rate limit exceeded
 *                 description: Error when API rate limit is exceeded
 *                 value:
 *                   error: "Rate limit exceeded"
 *                   code: "RATE_LIMIT_EXCEEDED"
 *                   details: "API rate limit exceeded. Please retry after the specified time."
 *       500:
 *         description: Internal Server Error - Server-side error occurred
 *         headers:
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 description: Error when an unexpected server error occurs
 *                 value:
 *                   error: "Internal server error occurred while checking ready SERP tasks"
 *                   code: "INTERNAL_ERROR"
 *                   details: "An unexpected error occurred. Please try again later."
 *               api_error:
 *                 summary: External API error
 *                 description: Error when DataForSEO API returns an error
 *                 value:
 *                   error: "DataForSEO API error"
 *                   code: "EXTERNAL_API_ERROR"
 *                   details: "The external API returned an error. Please try again later."
 *       503:
 *         description: Service Unavailable - External service temporarily unavailable
 *         headers:
 *           Retry-After:
 *             description: The time to wait before retrying the request
 *             schema:
 *               type: integer
 *               example: 300
 *           Content-Type:
 *             description: The content type of the error response
 *             schema:
 *               type: string
 *               example: application/json
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               service_unavailable:
 *                 summary: External service unavailable
 *                 description: Error when DataForSEO service is temporarily unavailable
 *                 value:
 *                   error: "DataForSEO service temporarily unavailable"
 *                   code: "SERVICE_UNAVAILABLE"
 *                   details: "The DataForSEO service is temporarily unavailable. Please try again later."
 */
export const serpTaskReady = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('SERP', `${ApiConfig.ENDPOINTS.SERP_GOOGLE_ORGANIC}/tasks_ready`);
        const response = await axios.get(url, {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });
        const data = response.data as SerpTaskReadyResponse;

        // Mettre à jour les tâches prêtes dans la base de données
        if (data.tasks && Array.isArray(data.tasks)) {
            for (const task of data.tasks) {
                // Pour les tâches prêtes, on met à jour uniquement isReady car les résultats ne sont pas encore récupérés
                await SerpTaskRepository.updateSerpTaskReady({
                    id: task.id,
                    status_code: task.status_code,
                    status_message: task.status_message,
                    time: task.time,
                    cost: task.cost,
                    result_count: task.result_count,
                    result: [] // Pas de résultats détaillés dans tasks_ready
                });
            }
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
