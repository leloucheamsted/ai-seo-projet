import { Request, Response } from 'express';
import { ContentAnalysisSummaryRepository } from '../../../repositories/urlAudit.repository';

/**
 * @swagger
 * /api/url-analyzer/content-analysis/groups:
 *   get:
 *     summary: Retrieve content analysis summary groups
 *     description: Get paginated list of content analysis summary task groups. Tasks are grouped by similar parameters (keyword, search mode, page type) and creation time windows (5-minute intervals).
 *     tags:
 *       - URL Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of groups per page
 *         example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved content analysis groups
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
 *               $ref: '#/components/schemas/ContentAnalysisGroupsResponse'
 *             examples:
 *               successful_groups:
 *                 summary: Successfully retrieved content analysis groups
 *                 value:
 *                   groups:
 *                     - group_id: "SEO optimization_web_blogs_1234567"
 *                       group_params:
 *                         keyword: "SEO optimization"
 *                         search_mode: "web"
 *                         page_type: ["blogs", "news"]
 *                         internal_list_limit: 100
 *                         positive_connotation_threshold: 0.6
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 2
 *                       total_cost: 0.08
 *                     - group_id: "digital marketing_web_news_1234566"
 *                       group_params:
 *                         keyword: "digital marketing"
 *                         search_mode: "web"
 *                         page_type: ["news", "blogs"]
 *                         internal_list_limit: 150
 *                         positive_connotation_threshold: 0.7
 *                       created_at: "2024-01-15T10:25:00.000Z"
 *                       tasks_count: 1
 *                       total_results: 1
 *                       total_cost: 0.04
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 12
 *                     total_pages: 2
 *                     has_next_page: true
 *                     has_prev_page: false
 *               empty_groups:
 *                 summary: No content analysis groups found
 *                 value:
 *                   groups: []
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 0
 *                     total_pages: 0
 *                     has_next_page: false
 *                     has_prev_page: false
 *       400:
 *         description: Bad request - Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_page:
 *                 summary: Invalid page parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "Page must be a positive integer"
 *               invalid_limit:
 *                 summary: Invalid limit parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "Limit must be between 1 and 100"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Authentication error"
 *               message: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 *               message: "An unexpected error occurred while retrieving content analysis groups"
 */
export const getContentAnalysisGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication error', message: 'Unauthorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Validation des paramètres
        if (page < 1) {
            return res.status(400).json({ error: 'Validation error', message: 'Page must be a positive integer' });
        }
        if (limit < 1 || limit > 100) {
            return res.status(400).json({ error: 'Validation error', message: 'Limit must be between 1 and 100' });
        }

        const result = await ContentAnalysisSummaryRepository.getTasksByGroups(userId, page, limit);
        res.json(result);
    } catch (error) {
        console.error('Error retrieving content analysis groups:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving content analysis groups'
        });
    }
};

/**
 * @swagger
 * /api/url-analyzer/content-analysis/groups/{groupId}:
 *   get:
 *     summary: Retrieve a specific content analysis summary group
 *     description: Get detailed information about a specific content analysis summary group including all tasks within the group
 *     tags:
 *       - URL Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the content analysis group (format keyword_searchMode_pageType_timeWindow)
 *         example: "SEO optimization_web_blogs_1234567"
 *     responses:
 *       200:
 *         description: Successfully retrieved content analysis group details
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
 *               $ref: '#/components/schemas/ContentAnalysisGroup'
 *             examples:
 *               successful_group_details:
 *                 summary: Successfully retrieved content analysis group with tasks
 *                 value:
 *                   group_id: "SEO optimization_web_blogs_1234567"
 *                   group_params:
 *                     keyword: "SEO optimization"
 *                     search_mode: "web"
 *                     page_type: ["blogs", "news"]
 *                     internal_list_limit: 100
 *                     positive_connotation_threshold: 0.6
 *                   created_at: "2024-01-15T10:30:00.000Z"
 *                   tasks_count: 2
 *                   total_results: 2
 *                   total_cost: 0.08
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 1
 *                       cost: 0.04
 *                       data:
 *                         api: "content_analysis"
 *                         function: "summary"
 *                         keyword: "SEO optimization"
 *                         search_mode: "web"
 *                       result:
 *                         - type: "summary"
 *                           total_count: 150
 *                           rank: 1
 *                           top_domains:
 *                             - domain: "moz.com"
 *                               count: 25
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *               single_task_group:
 *                 summary: Content analysis group with single task
 *                 value:
 *                   group_id: "digital marketing_web_news_1234566"
 *                   tasks_count: 1
 *                   total_results: 1
 *                   total_cost: 0.04
 *       400:
 *         description: Bad request - Invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_group_id:
 *                 summary: Invalid group ID format
 *                 value:
 *                   error: "Validation error"
 *                   message: "Invalid group ID format"
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
 *         description: Not found - Content analysis group does not exist or does not belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               group_not_found:
 *                 summary: Content analysis group not found
 *                 value:
 *                   error: "Not found"
 *                   message: "Group not found"
 *               group_not_owned:
 *                 summary: Content analysis group does not belong to user
 *                 value:
 *                   error: "Not found"
 *                   message: "Group not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 *               message: "An unexpected error occurred while retrieving content analysis group details"
 */
export const getContentAnalysisGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication error', message: 'Unauthorized' });
        }

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const group = await ContentAnalysisSummaryRepository.getTaskGroupById(userId, groupId);
        res.json(group);
    } catch (error) {
        console.error('Error retrieving content analysis group details:', error);
        if ((error as Error).message === 'Group not found' || (error as Error).message === 'Invalid group ID format') {
            return res.status(404).json({ error: 'Not found', message: 'Group not found' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving content analysis group details'
        });
    }
};

/**
 * @swagger
 * /api/url-analyzer/content-analysis/groups/{groupId}:
 *   delete:
 *     summary: Delete a content analysis summary group
 *     description: Delete a specific content analysis summary group and all its associated tasks permanently. This action cannot be undone.
 *     tags:
 *       - URL Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the content analysis group to delete (format keyword_searchMode_pageType_timeWindow)
 *         example: "SEO optimization_web_blogs_1234567"
 *     responses:
 *       200:
 *         description: Successfully deleted content analysis group
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful deletion
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Content analysis group deleted successfully"
 *                 deleted_tasks_count:
 *                   type: integer
 *                   description: Number of tasks deleted
 *                   example: 2
 *               required:
 *                 - success
 *                 - message
 *                 - deleted_tasks_count
 *             examples:
 *               successful_deletion:
 *                 summary: Successfully deleted content analysis group
 *                 value:
 *                   success: true
 *                   message: "Content analysis group deleted successfully"
 *                   deleted_tasks_count: 2
 *               single_task_deletion:
 *                 summary: Successfully deleted group with single task
 *                 value:
 *                   success: true
 *                   message: "Content analysis group deleted successfully"
 *                   deleted_tasks_count: 1
 *       400:
 *         description: Bad request - Invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               invalid_group_id:
 *                 summary: Invalid group ID format
 *                 value:
 *                   error: "Validation error"
 *                   message: "Invalid group ID format"
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
 *         description: Not found - Content analysis group does not exist or does not belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               group_not_found:
 *                 summary: Content analysis group not found
 *                 value:
 *                   error: "Not found"
 *                   message: "Group not found"
 *               group_not_owned:
 *                 summary: Content analysis group does not belong to user
 *                 value:
 *                   error: "Not found"
 *                   message: "Group not found"
 *       500:
 *         description: Internal server error - Database error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               database_error:
 *                 summary: Database deletion error
 *                 value:
 *                   error: "Internal server error"
 *                   message: "Database error occurred during deletion"
 *               server_error:
 *                 summary: General server error
 *                 value:
 *                   error: "Internal server error"
 *                   message: "An unexpected error occurred while deleting content analysis group"
 */
export const deleteContentAnalysisGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication error', message: 'Unauthorized' });
        }

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const deletedCount = await ContentAnalysisSummaryRepository.deleteTaskGroup(userId, groupId);
        res.json({
            success: true,
            message: 'Content analysis group deleted successfully',
            deleted_tasks_count: deletedCount
        });
    } catch (error) {
        console.error('Error deleting content analysis group:', error);
        if ((error as Error).message === 'Group not found' || (error as Error).message === 'Invalid group ID format') {
            return res.status(404).json({ error: 'Not found', message: 'Group not found' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while deleting content analysis group'
        });
    }
};
