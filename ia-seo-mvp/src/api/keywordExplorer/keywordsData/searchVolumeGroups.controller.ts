import { Request, Response } from 'express';
import { SearchVolumeRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/search-volume/groups:
 *   get:
 *     summary: Get search volume data grouped by similar parameters
 *     description: Retrieve paginated search volume groups based on similar parameters and creation time windows. Groups tasks that were created with the same keywords, location, and language within a 5-minute time window.
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
 *         description: Search volume groups successfully retrieved
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
 *               $ref: '#/components/schemas/SearchVolumeGroupsResponse'
 *             examples:
 *               successful_groups_response:
 *                 summary: Successful search volume groups response
 *                 value:
 *                   success: true
 *                   groups:
 *                     - group_id: "keyword research|SEO tools|digital marketing_2840_en_12345678"
 *                       group_params:
 *                         keywords: ["keyword research", "SEO tools", "digital marketing"]
 *                         location_code: 2840
 *                         language_code: "en"
 *                         search_partners: false
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 75
 *                       total_cost: 0.02
 *                       tasks:
 *                         - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                           status_code: 20000
 *                           status_message: "Ok."
 *                           result_count: 35
 *                           cost: 0.01
 *                         - id: "live_task_87654321-4321-4321-4321-210987654321"
 *                           status_code: 20000
 *                           status_message: "Ok."
 *                           result_count: 40
 *                           cost: 0.01
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 25
 *                     total_pages: 3
 *                     has_next_page: true
 *                     has_prev_page: false
 *               empty_groups_response:
 *                 summary: No search volume groups found
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
 *               message: "An unexpected error occurred while retrieving search volume groups"
 */
export const getSearchVolumeGroups = async (req: Request, res: Response) => {
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

        const result = await SearchVolumeRepository.getTasksByGroups(userId, page, limit);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Error getting search volume groups:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving search volume groups'
        });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/search-volume/groups/{groupId}:
 *   get:
 *     summary: Get a specific search volume group by ID
 *     description: Retrieve detailed information about a specific search volume group, including all tasks and their complete results. The group ID is constructed from keywords, location, language, and time window.
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
 *         description: Unique group identifier (format- keywords_locationCode_languageCode_timeWindow)
 *         example: "keyword research|SEO tools|digital marketing_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Search volume group details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchVolumeGroupByIdResponse'
 *             examples:
 *               successful_group_details:
 *                 summary: Successful group details response
 *                 value:
 *                   success: true
 *                   group:
 *                     group_id: "keyword research|SEO tools|digital marketing_2840_en_12345678"
 *                     group_params:
 *                       keywords: ["keyword research", "SEO tools", "digital marketing"]
 *                       location_code: 2840
 *                       language_code: "en"
 *                       search_partners: false
 *                       date_from: "2024-01-01"
 *                       date_to: "2024-12-31"
 *                     created_at: "2024-01-15T10:30:00.000Z"
 *                     tasks_count: 2
 *                     total_results: 75
 *                     total_cost: 0.02
 *                     tasks:
 *                       - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                         status_code: 20000
 *                         status_message: "Ok."
 *                         cost: 0.01
 *                         result_count: 35
 *                         isReady: true
 *                         result:
 *                           - keyword: "keyword research"
 *                             search_volume: 8500
 *                             competition: 0.72
 *                             competition_index: 72
 *                           - keyword: "SEO tools"
 *                             search_volume: 12000
 *                             competition: 0.65
 *                             competition_index: 65
 *                           - keyword: "digital marketing"
 *                             search_volume: 45000
 *                             competition: 0.58
 *                             competition_index: 58
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
 *         description: Not found - Search volume group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Not found"
 *               message: "Search volume group not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Internal server error"
 *               message: "An unexpected error occurred while retrieving search volume group"
 */
export const getSearchVolumeGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const group = await SearchVolumeRepository.getTaskGroupById(userId, groupId);

        if (!group) {
            return res.status(404).json({ error: 'Not found', message: 'Search volume group not found' });
        }

        res.json({
            success: true,
            group
        });
    } catch (error) {
        console.error('Error getting search volume group:', error);
        if (error instanceof Error && error.message === 'Invalid group ID format') {
            return res.status(400).json({ error: 'Validation error', message: 'Invalid group ID format' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving search volume group'
        });
    }
};

/**
 * @swagger
 * /api/keyword-explorer/search-volume/groups/{groupId}:
 *   delete:
 *     summary: Delete a search volume group and all its tasks
 *     description: Permanently delete a search volume group and all associated tasks. This action cannot be undone. Only tasks belonging to the authenticated user will be deleted.
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
 *         example: "keyword research|SEO tools|digital marketing_2840_en_12345678"
 *     responses:
 *       200:
 *         description: Search volume group successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchVolumeGroupDeleteResponse'
 *             examples:
 *               successful_deletion:
 *                 summary: Successful group deletion
 *                 value:
 *                   success: true
 *                   message: "Search volume group deleted successfully"
 *                   deleted_count: 2
 *               no_tasks_found:
 *                 summary: No tasks found to delete
 *                 value:
 *                   success: true
 *                   message: "No tasks found for the specified search volume group"
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
 *               message: "An unexpected error occurred while deleting search volume group"
 */
export const deleteSearchVolumeGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const deletedCount = await SearchVolumeRepository.deleteTaskGroup(userId, groupId);

        res.json({
            success: true,
            message: deletedCount > 0
                ? 'Search volume group deleted successfully'
                : 'No tasks found for the specified search volume group',
            deleted_count: deletedCount
        });
    } catch (error) {
        console.error('Error deleting search volume group:', error);
        if (error instanceof Error && error.message === 'Invalid group ID format') {
            return res.status(400).json({ error: 'Validation error', message: 'Invalid group ID format' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while deleting search volume group'
        });
    }
};
