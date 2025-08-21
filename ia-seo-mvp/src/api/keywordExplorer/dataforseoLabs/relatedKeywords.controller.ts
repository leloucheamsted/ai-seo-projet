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
 *     description: Retrieve related keywords for a given keyword using DataForSEO Labs API
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RelatedKeywordsParams'
 *           examples:
 *             basic:
 *               summary: Basic request
 *               value:
 *                 keyword: "SEO tools"
 *                 location_name: "United States"
 *                 language_code: "en"
 *                 limit: 50
 *             advanced:
 *               summary: Advanced request with filters
 *               value:
 *                 keyword: "digital marketing"
 *                 location_code: "2840"
 *                 language_code: "en"
 *                 depth: 2
 *                 include_serp_info: true
 *                 limit: 100
 *                 offset: 0
 *     responses:
 *       200:
 *         description: Related keywords successfully retrieved
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
 *               $ref: '#/components/schemas/RelatedKeywordsResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2025-08-19T14:30:00Z"
 *                   cost: 0.105
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       cost: 0.105
 *                       result_count: 50
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_keyword:
 *                 summary: Missing keyword parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "keyword is required"
 *               invalid_limit:
 *                 summary: Invalid limit parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "limit must be between 1 and 1000"
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
 *         headers:
 *           X-RateLimit-Remaining:
 *             description: Number of requests remaining (0)
 *             schema:
 *               type: integer
 *           X-RateLimit-Reset:
 *             description: Time when rate limit resets (Unix timestamp)
 *             schema:
 *               type: integer
 *           Retry-After:
 *             description: Seconds to wait before retrying
 *             schema:
 *               type: integer
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
                }, params);
            }
        }
        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/related-keywords/groups:
 *   get:
 *     summary: Get related keywords tasks grouped by similar requests (with pagination)
 *     description: |
 *       Retrieves all related keywords tasks grouped by similar parameters and creation time.
 *       Tasks belonging to the same base query (same keyword, location, language) created within 
 *       a 5-minute window are grouped together to help organize batch requests.
 *       
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
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Filter groups by keyword (partial match)
 *         example: "SEO"
 *     responses:
 *       200:
 *         description: Successfully retrieved grouped tasks with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       group_id:
 *                         type: string
 *                         description: Unique identifier for the group
 *                         example: "SEO tools_2840_en_12345678"
 *                       group_params:
 *                         type: object
 *                         properties:
 *                           keyword:
 *                             type: string
 *                             example: "SEO tools"
 *                           location_code:
 *                             type: integer
 *                             example: 2840
 *                           language_code:
 *                             type: string
 *                             example: "en"
 *                           limit:
 *                             type: integer
 *                             example: 50
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         description: Creation time of the first task in group
 *                       tasks_count:
 *                         type: integer
 *                         description: Number of tasks in this group
 *                         example: 3
 *                       total_results:
 *                         type: integer
 *                         description: Total result count across all tasks
 *                         example: 150
 *                       total_cost:
 *                         type: number
 *                         format: float
 *                         description: Total cost across all tasks
 *                         example: 0.15
 *                       tasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             status_code:
 *                               type: integer
 *                             status_message:
 *                               type: string
 *                             time:
 *                               type: string
 *                             cost:
 *                               type: number
 *                             result_count:
 *                               type: integer
 *                             result:
 *                               type: array
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     per_page:
 *                       type: integer
 *                       description: Number of items per page
 *                       example: 10
 *                     total_items:
 *                       type: integer
 *                       description: Total number of groups
 *                       example: 25
 *                     total_pages:
 *                       type: integer
 *                       description: Total number of pages
 *                       example: 3
 *                     has_next_page:
 *                       type: boolean
 *                       description: Whether there is a next page
 *                       example: true
 *                     has_prev_page:
 *                       type: boolean
 *                       description: Whether there is a previous page
 *                       example: false
 *             examples:
 *               paginated_groups:
 *                 summary: Example paginated grouped tasks
 *                 value:
 *                   success: true
 *                   groups:
 *                     - group_id: "SEO tools_2840_en_12345678"
 *                       group_params:
 *                         keyword: "SEO tools"
 *                         location_code: 2840
 *                         language_code: "en"
 *                         limit: 50
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 100
 *                       total_cost: 0.1
 *                       tasks:
 *                         - id: "task_1"
 *                           status_code: 20000
 *                           status_message: "Ok."
 *                           time: "2024-01-15T10:30:00.000Z"
 *                           cost: 0.05
 *                           result_count: 50
 *                           result: []
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 25
 *                     total_pages: 3
 *                     has_next_page: true
 *                     has_prev_page: false
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid pagination parameters"
 *             examples:
 *               invalid_page:
 *                 summary: Invalid page number
 *                 value:
 *                   success: false
 *                   message: "Page must be a positive integer"
 *               invalid_limit:
 *                 summary: Invalid limit value
 *                 value:
 *                   success: false
 *                   message: "Limit must be between 1 and 100"
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */
export const getRelatedKeywordsGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // Récupérer les paramètres de pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const keywordFilter = req.query.keyword as string;

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

        const result = await RelatedKeywordsRepository.getTasksByGroups(userId, page, limit);

        // Appliquer le filtre par mot-clé si fourni
        let filteredGroups = result.groups;
        if (keywordFilter) {
            filteredGroups = result.groups.filter(group =>
                group.group_params.keyword?.toLowerCase().includes(keywordFilter.toLowerCase())
            );

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
 * /api/keyword-explorer/related-keywords/groups/{groupId}:
 *   get:
 *     summary: Get a specific related keywords task group
 *     description: |
 *       Retrieves detailed information about a specific group of related keywords tasks.
 *       Includes all tasks and their complete results for the specified group ID.
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
 *         description: Group identifier (format: keyword_locationCode_languageCode_timeWindow)
 *         example: "SEO tools_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Successfully retrieved group details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 group:
 *                   type: object
 *                   properties:
 *                     group_id:
 *                       type: string
 *                     group_params:
 *                       type: object
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     tasks_count:
 *                       type: integer
 *                     total_results:
 *                       type: integer
 *                     total_cost:
 *                       type: number
 *                     tasks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RelatedKeywordsTask'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal server error
 */
export const getRelatedKeywordsGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;
        const group = await RelatedKeywordsRepository.getTaskGroupById(userId, groupId);

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
 * /api/keyword-explorer/related-keywords/groups/{groupId}:
 *   delete:
 *     summary: Delete a related keywords task group
 *     description: |
 *       Deletes all tasks belonging to a specific group. This action cannot be undone.
 *       All tasks with the same base query parameters created within the same time window
 *       will be permanently removed from the database.
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
 *         example: "SEO tools_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Group successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Group deleted successfully"
 *                 deleted_count:
 *                   type: integer
 *                   description: Number of tasks deleted
 *                   example: 3
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Group not found or already deleted"
 *       500:
 *         description: Internal server error
 */
export const deleteRelatedKeywordsGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;
        const deletedCount = await RelatedKeywordsRepository.deleteTaskGroup(userId, groupId);

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
