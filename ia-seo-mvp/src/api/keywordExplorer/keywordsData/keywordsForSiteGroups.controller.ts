import { Request, Response } from 'express';
import { KeywordsForSiteRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-site/groups:
 *   get:
 *     summary: Get keywords for site data grouped by similar parameters
 *     description: Retrieve paginated keywords for site groups based on similar parameters and creation time windows. Groups tasks that were created with the same target, location, and language within a 5-minute time window.
 *     tags:
 *       - Keyword Explorer
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
 *         description: Keywords for site groups successfully retrieved
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
 *               $ref: '#/components/schemas/KeywordsForSiteGroupsResponse'
 *             examples:
 *               successful_groups_response:
 *                 summary: Successful keywords for site groups response
 *                 value:
 *                   success: true
 *                   groups:
 *                     - group_id: "example.com_domain_2840_en_12345678"
 *                       group_params:
 *                         target: "example.com"
 *                         target_type: "domain"
 *                         location_code: 2840
 *                         language_code: "en"
 *                         sort_by: "search_volume"
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 45
 *                       total_cost: 0.04
 *                       tasks:
 *                         - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                           status_code: 20000
 *                           status_message: "Ok."
 *                           result_count: 23
 *                           cost: 0.02
 *                         - id: "live_task_87654321-4321-4321-4321-210987654321"
 *                           status_code: 20000
 *                           status_message: "Ok."
 *                           result_count: 22
 *                           cost: 0.02
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 15
 *                     total_pages: 2
 *                     has_next_page: true
 *                     has_prev_page: false
 *               empty_groups_response:
 *                 summary: No keywords for site groups found
 *                 value:
 *                   success: true
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
 *                 summary: Invalid page number
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
 *               message: "An unexpected error occurred while retrieving keywords for site groups"
 */
export const getKeywordsForSiteGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        // Validation des paramètres
        if (page < 1) {
            return res.status(400).json({ error: 'Validation error', message: 'Page must be a positive integer' });
        }
        if (limit < 1 || limit > 100) {
            return res.status(400).json({ error: 'Validation error', message: 'Limit must be between 1 and 100' });
        }

        const result = await KeywordsForSiteRepository.getTasksByGroups(userId, page, limit);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error getting keywords for site groups:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving keywords for site groups'
        });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-site/groups/{groupId}:
 *   get:
 *     summary: Get a specific keywords for site group by ID
 *     description: Retrieve detailed information about a specific keywords for site group, including all tasks and their complete results. The group ID is constructed from target, target_type, location, language, and time window.
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
 *         description: Unique group identifier (format- target_targetType_locationCode_languageCode_timeWindow)
 *         example: "example.com_domain_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Keywords for site group details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForSiteGroupByIdResponse'
 *             examples:
 *               successful_group_details:
 *                 summary: Successful group details response
 *                 value:
 *                   success: true
 *                   group:
 *                     group_id: "example.com_domain_2840_en_12345678"
 *                     group_params:
 *                       target: "example.com"
 *                       target_type: "domain"
 *                       location_code: 2840
 *                       language_code: "en"
 *                       sort_by: "search_volume"
 *                       include_adult_keywords: false
 *                     created_at: "2024-01-15T10:30:00.000Z"
 *                     tasks_count: 2
 *                     total_results: 45
 *                     total_cost: 0.04
 *                     tasks:
 *                       - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                         status_code: 20000
 *                         status_message: "Ok."
 *                         cost: 0.02
 *                         result_count: 23
 *                         isReady: true
 *                         result:
 *                           - keyword: "SEO tools"
 *                             search_volume: 8500
 *                             competition: "MEDIUM"
 *                             competition_index: 65
 *                           - keyword: "keyword research"
 *                             search_volume: 5200
 *                             competition: "HIGH"
 *                             competition_index: 78
 *       400:
 *         description: Bad request - Invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation error"
 *               message: "Invalid group ID format"
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
 *         description: Not found - Keywords for site group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Not found"
 *               message: "Keywords for site group not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 *               message: "An unexpected error occurred while retrieving keywords for site group"
 */
export const getKeywordsForSiteGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const group = await KeywordsForSiteRepository.getTaskGroupById(userId, groupId);

        if (!group) {
            return res.status(404).json({ error: 'Not found', message: 'Keywords for site group not found' });
        }

        res.json({
            success: true,
            group
        });
    } catch (error) {
        console.error('Error getting keywords for site group:', error);
        if (error instanceof Error && error.message === 'Invalid group ID format') {
            return res.status(400).json({ error: 'Validation error', message: 'Invalid group ID format' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving keywords for site group'
        });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-site/groups/{groupId}:
 *   delete:
 *     summary: Delete a keywords for site group and all its tasks
 *     description: Permanently delete a keywords for site group and all associated tasks. This action cannot be undone. Only tasks belonging to the authenticated user will be deleted.
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
 *         description: Unique group identifier to delete
 *         example: "example.com_domain_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Keywords for site group successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeywordsForSiteGroupDeleteResponse'
 *             examples:
 *               successful_deletion:
 *                 summary: Successful group deletion
 *                 value:
 *                   success: true
 *                   message: "Keywords for site group deleted successfully"
 *                   deleted_count: 2
 *               no_tasks_found:
 *                 summary: No tasks found to delete
 *                 value:
 *                   success: true
 *                   message: "No tasks found for the specified keywords for site group"
 *                   deleted_count: 0
 *       400:
 *         description: Bad request - Invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Validation error"
 *               message: "Invalid group ID format"
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
 *               message: "An unexpected error occurred while deleting keywords for site group"
 */
export const deleteKeywordsForSiteGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const deletedCount = await KeywordsForSiteRepository.deleteTaskGroup(userId, groupId);

        res.json({
            success: true,
            message: deletedCount > 0
                ? 'Keywords for site group deleted successfully'
                : 'No tasks found for the specified keywords for site group',
            deleted_count: deletedCount
        });
    } catch (error) {
        console.error('Error deleting keywords for site group:', error);
        if (error instanceof Error && error.message === 'Invalid group ID format') {
            return res.status(400).json({ error: 'Validation error', message: 'Invalid group ID format' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while deleting keywords for site group'
        });
    }
};
