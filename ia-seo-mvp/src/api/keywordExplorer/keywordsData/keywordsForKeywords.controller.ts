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
 * /api/keyword-explorer/keywords-for-keywords/post:
 *   post:
 *     summary: Create a keywords for keywords analysis task
 *     description: Submit a task to analyze keywords data using DataForSEO Keywords Data API (POST method)
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForKeywordsPostParams'
 *           examples:
 *             basic:
 *               summary: Basic keywords analysis
 *               value:
 *                 keywords: ["SEO tools", "keyword research"]
 *                 location_name: "United States"
 *                 language_code: "en"
 *             advanced:
 *               summary: Advanced analysis with callbacks
 *               value:
 *                 keywords: ["digital marketing", "content marketing", "social media marketing"]
 *                 location_code: "2840"
 *                 language_code: "en"
 *                 target: "example.com"
 *                 postback_url: "https://your-domain.com/postback"
 *                 sort_by: "search_volume"
 *                 include_adult_keywords: false
 *     responses:
 *       200:
 *         description: Task successfully created
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in current time window
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: Time when rate limit resets (Unix timestamp)
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsResponse'
 *             examples:
 *               task_created:
 *                 summary: Task successfully created
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.01
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20100
 *                       status_message: "Task Created."
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_keywords:
 *                 summary: Missing keywords parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords (array) is required"
 *               empty_keywords:
 *                 summary: Empty keywords array
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords array cannot be empty"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Authentication error"
 *               message: "Unauthorized"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Rate limit exceeded"
 *               message: "Too many requests, please try again later"
 *       500:
 *         description: Internal server error - DataForSEO API error or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               api_error:
 *                 summary: DataForSEO API error
 *                 value:
 *                   error: "External API error"
 *                   message: "DataForSEO API returned an error"
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   error: "Internal server error"
 *                   message: "An unexpected error occurred"
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
                await KeywordsForKeywordsRepository.saveTaskPostKeywordForKeyword(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords/get/{id}:
 *   get:
 *     summary: Get keywords for keywords task results
 *     description: Retrieve the results of a previously submitted keywords analysis task
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID returned from the POST request
 *         schema:
 *           type: string
 *           example: "task_12345678-1234-1234-1234-123456789012"
 *     responses:
 *       200:
 *         description: Task results successfully retrieved
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in current time window
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: Time when rate limit resets (Unix timestamp)
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsResponse'
 *             examples:
 *               completed_task:
 *                 summary: Task completed with results
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.01
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 3
 *                       result:
 *                         - keyword: "SEO tools"
 *                           search_volume: 12000
 *                           competition: 0.65
 *               pending_task:
 *                 summary: Task still processing
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20100
 *                       status_message: "Task In Queue."
 *       400:
 *         description: Bad request - Invalid task ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation error"
 *               message: "id is required"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Authentication error"
 *               message: "Unauthorized"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Not found"
 *               message: "Task not found or expired"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Rate limit exceeded"
 *               message: "Too many requests, please try again later"
 *       500:
 *         description: Internal server error - DataForSEO API error or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "External API error"
 *               message: "DataForSEO API returned an error"
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
 * /api/keyword-explorer/keywords-for-keywords/ready/{id}:
 *   get:
 *     summary: Check if keywords for keywords task is ready
 *     description: Check the status of a keywords analysis task to see if it's completed and ready for retrieval
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Task ID returned from the POST request
 *         schema:
 *           type: string
 *           example: "task_12345678-1234-1234-1234-123456789012"
 *     responses:
 *       200:
 *         description: Task status successfully retrieved
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in current time window
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: Time when rate limit resets (Unix timestamp)
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsReadyResponse'
 *             examples:
 *               task_ready:
 *                 summary: Task is ready
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.00
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Task ready."
 *               task_pending:
 *                 summary: Task is still processing
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20100
 *                       status_message: "Task In Queue."
 *       400:
 *         description: Bad request - Invalid task ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation error"
 *               message: "id is required"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Authentication error"
 *               message: "Unauthorized"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Not found"
 *               message: "Task not found or expired"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Rate limit exceeded"
 *               message: "Too many requests, please try again later"
 *       500:
 *         description: Internal server error - DataForSEO API error or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "External API error"
 *               message: "DataForSEO API returned an error"
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
 * /api/keyword-explorer/keywords-for-keywords/live:
 *   post:
 *     summary: Get live keywords for keywords data
 *     description: Get instant keyword data analysis without creating a task (live request)
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForKeywordsLiveParams'
 *           examples:
 *             basic:
 *               summary: Basic live analysis
 *               value:
 *                 keywords: ["SEO tools", "keyword research"]
 *                 location_name: "United States"
 *                 language_code: "en"
 *             advanced:
 *               summary: Advanced live analysis with sorting
 *               value:
 *                 keywords: ["digital marketing", "content marketing", "email marketing"]
 *                 location_code: "2840"
 *                 language_code: "en"
 *                 sort_by: "search_volume"
 *                 include_adult_keywords: false
 *                 date_from: "2024-01-01"
 *                 date_to: "2024-12-31"
 *     responses:
 *       200:
 *         description: Live keyword data successfully retrieved
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining in current time window
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: Time when rate limit resets (Unix timestamp)
 *             schema:
 *               type: integer
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsResponse'
 *             examples:
 *               success:
 *                 summary: Successful live response
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.01
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 3
 *                       result:
 *                         - keyword: "SEO tools"
 *                           search_volume: 12000
 *                           competition: 0.65
 *                           competition_index: 65
 *                           low_top_of_page_bid: 1.25
 *                           high_top_of_page_bid: 3.75
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_keywords:
 *                 summary: Missing keywords parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords (array) is required"
 *               empty_keywords:
 *                 summary: Empty keywords array
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords array cannot be empty"
 *               too_many_keywords:
 *                 summary: Too many keywords
 *                 value:
 *                   error: "Validation error"
 *                   message: "Maximum 1000 keywords allowed"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Authentication error"
 *               message: "Unauthorized"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Rate limit exceeded"
 *               message: "Too many requests, please try again later"
 *       500:
 *         description: Internal server error - DataForSEO API error or server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               api_error:
 *                 summary: DataForSEO API error
 *                 value:
 *                   error: "External API error"
 *                   message: "DataForSEO API returned an error"
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   error: "Internal server error"
 *                   message: "An unexpected error occurred"
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
                await KeywordsForKeywordsRepository.saveTaskLiveKeywordForKeyword(task, params);
            }
        }

        res.json(responseData as KeywordsForKeywordsResponse);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords/groups:
 *   get:
 *     summary: Get keywords for keywords tasks grouped by similar requests (with pagination)
 *     description: |
 *       Retrieves all keywords for keywords tasks grouped by similar parameters and creation time.
 *       Tasks belonging to the same base query (same keywords, location, language) created within 
 *       a 5-minute window are grouped together to help organize batch requests.
 *       
 *       Only includes tasks where isSearchVolumn is false or null.
 *       Supports pagination with configurable page size and navigation information.
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of groups per page
 *         example: 10
 *       - in: query
 *         name: keywords
 *         schema:
 *           type: string
 *         description: Filter groups by keywords (partial match)
 *         example: "SEO"
 *     responses:
 *       200:
 *         description: Successfully retrieved grouped tasks with pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsGroupsResponse'
 *             examples:
 *               paginated_groups:
 *                 summary: Example paginated grouped tasks
 *                 value:
 *                   success: true
 *                   groups:
 *                     - group_id: "keyword research|SEO tools_2840_en_12345678"
 *                       group_params:
 *                         keywords: ["keyword research", "SEO tools"]
 *                         location_code: 2840
 *                         language_code: "en"
 *                         target: null
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 100
 *                       total_cost: 0.02
 *                       tasks:
 *                         - id: "task_1"
 *                           status_code: 20000
 *                           status_message: "Ok."
 *                           time: "2024-01-15T10:30:00.000Z"
 *                           cost: 0.01
 *                           result_count: 50
 *                           isReady: true
 *                           result: []
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 15
 *                     total_pages: 2
 *                     has_next_page: true
 *                     has_prev_page: false
 *       400:
 *         description: Invalid pagination parameters
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export const getKeywordsForKeywordsGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // Récupérer les paramètres de pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const keywordsFilter = req.query.keywords as string;

        // Validation des paramètres de pagination
        if (page < 1) {
            return res.status(400).json({
                success: false,
                message: 'Page must be a positive integer'
            });
        }

        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: 'Limit must be between 1 and 100'
            });
        }

        const result = await KeywordsForKeywordsRepository.getTasksByGroups(userId, page, limit);

        // Appliquer le filtre par mots-clés si fourni
        let filteredGroups = result.groups;
        if (keywordsFilter) {
            filteredGroups = result.groups.filter(group => {
                const keywords = group.group_params.keywords;
                if (Array.isArray(keywords)) {
                    return keywords.some(keyword =>
                        keyword.toLowerCase().includes(keywordsFilter.toLowerCase())
                    );
                }
                return false;
            });

            // Recalculer la pagination pour les résultats filtrés
            const totalFiltered = filteredGroups.length;
            result.pagination.total_items = totalFiltered;
            result.pagination.total_pages = Math.ceil(totalFiltered / limit);
            result.pagination.has_next_page = page < result.pagination.total_pages;
        }

        res.json({
            success: true,
            groups: filteredGroups,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : error
        });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords/groups/{groupId}:
 *   get:
 *     summary: Get a specific keywords for keywords task group
 *     description: |
 *       Retrieves detailed information about a specific group of keywords for keywords tasks.
 *       Includes all tasks and their complete results for the specified group ID.
 *       Only includes tasks where isSearchVolumn is false or null.
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group identifier (format: keywords_locationCode_languageCode_timeWindow)
 *         example: "keyword research|SEO tools_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Successfully retrieved group details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsGroupByIdResponse'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
export const getKeywordsForKeywordsGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;
        const group = await KeywordsForKeywordsRepository.getTaskGroupById(userId, groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        res.json({
            success: true,
            group: group
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid group ID format') {
            return res.status(400).json({
                success: false,
                message: 'Invalid group ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : error
        });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-keywords/groups/{groupId}:
 *   delete:
 *     summary: Delete a keywords for keywords task group
 *     description: |
 *       Deletes all tasks belonging to a specific group. This action cannot be undone.
 *       All tasks with the same base query parameters created within the same time window
 *       will be permanently removed from the database.
 *       Only affects tasks where isSearchVolumn is false or null.
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group identifier to delete
 *         example: "keyword research|SEO tools_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Group successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForKeywordsGroupDeleteResponse'
 *             examples:
 *               successful_deletion:
 *                 summary: Successful group deletion
 *                 value:
 *                   success: true
 *                   message: "Group deleted successfully"
 *                   deleted_count: 3
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Group not found or no tasks to delete
 *       500:
 *         description: Internal server error
 */
export const deleteKeywordsForKeywordsGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;
        const deletedCount = await KeywordsForKeywordsRepository.deleteTaskGroup(userId, groupId);

        if (deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Group not found or already deleted'
            });
        }

        res.json({
            success: true,
            message: 'Group deleted successfully',
            deleted_count: deletedCount
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid group ID format') {
            return res.status(400).json({
                success: false,
                message: 'Invalid group ID format'
            });
        }
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : error
        });
    }
};

