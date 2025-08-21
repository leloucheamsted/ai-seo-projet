import { Request, Response } from 'express';
import { DomainCompetitorsRepository } from '../../../repositories/rankMonitor.repository';

/**
 * @swagger
 * /api/rank-monitor/domain-analytics/competitors/groups:
 *   get:
 *     summary: Retrieve domain competitors analysis groups
 *     description: Get paginated list of domain competitors analysis task groups. Tasks are grouped by similar parameters (target domain, location, language) and creation time windows (5-minute intervals).
 *     tags:
 *       - Rank Monitor
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
 *         description: Successfully retrieved domain competitors groups
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
 *               $ref: '#/components/schemas/DomainCompetitorsGroupsResponse'
 *             examples:
 *               successful_groups:
 *                 summary: Successfully retrieved domain competitors groups
 *                 value:
 *                   groups:
 *                     - group_id: "example.com_2840_en_1234567"
 *                       group_params:
 *                         target: "example.com"
 *                         location_code: 2840
 *                         location_name: "United States"
 *                         language_code: "en"
 *                         language_name: "English"
 *                         limit: 50
 *                         item_types: ["organic"]
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 100
 *                       total_cost: 0.24
 *                     - group_id: "mysite.com_2826_en_1234566"
 *                       group_params:
 *                         target: "mysite.com"
 *                         location_code: 2826
 *                         location_name: "United Kingdom"
 *                         language_code: "en"
 *                         language_name: "English"
 *                         limit: 25
 *                         item_types: ["organic", "paid"]
 *                       created_at: "2024-01-15T10:25:00.000Z"
 *                       tasks_count: 1
 *                       total_results: 25
 *                       total_cost: 0.12
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 15
 *                     total_pages: 2
 *                     has_next_page: true
 *                     has_prev_page: false
 *               empty_groups:
 *                 summary: No domain competitors groups found
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
 *               message: "An unexpected error occurred while retrieving domain competitors groups"
 */
export const getDomainCompetitorsGroups = async (req: Request, res: Response) => {
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

        const result = await DomainCompetitorsRepository.getTasksByGroups(userId, page, limit);
        res.json(result);
    } catch (error) {
        console.error('Error retrieving domain competitors groups:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving domain competitors groups'
        });
    }
};

/**
 * @swagger
 * /api/rank-monitor/domain-analytics/competitors/groups/{groupId}:
 *   get:
 *     summary: Retrieve a specific domain competitors analysis group
 *     description: Get detailed information about a specific domain competitors analysis group including all tasks within the group
 *     tags:
 *       - Rank Monitor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the domain competitors group (format target_location_language_timeWindow)
 *         example: "example.com_2840_en_1234567"
 *     responses:
 *       200:
 *         description: Successfully retrieved domain competitors group details
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
 *               $ref: '#/components/schemas/DomainCompetitorsGroup'
 *             examples:
 *               successful_group_details:
 *                 summary: Successfully retrieved domain competitors group with tasks
 *                 value:
 *                   group_id: "example.com_2840_en_1234567"
 *                   group_params:
 *                     target: "example.com"
 *                     location_code: 2840
 *                     location_name: "United States"
 *                     language_code: "en"
 *                     language_name: "English"
 *                     limit: 50
 *                     item_types: ["organic"]
 *                   created_at: "2024-01-15T10:30:00.000Z"
 *                   tasks_count: 2
 *                   total_results: 100
 *                   total_cost: 0.24
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 50
 *                       cost: 0.12
 *                       data:
 *                         api: "domain_analytics"
 *                         function: "competitors"
 *                         target: "example.com"
 *                         location_code: 2840
 *                       result:
 *                         - se_type: "google"
 *                           target: "example.com"
 *                           location_code: 2840
 *                           language_code: "en"
 *                           total_count: 1250
 *                           items_count: 50
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *               single_task_group:
 *                 summary: Domain competitors group with single task
 *                 value:
 *                   group_id: "mysite.com_2826_en_1234566"
 *                   tasks_count: 1
 *                   total_results: 25
 *                   total_cost: 0.12
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
 *         description: Not found - Domain competitors group does not exist or does not belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               group_not_found:
 *                 summary: Domain competitors group not found
 *                 value:
 *                   error: "Not found"
 *                   message: "Group not found"
 *               group_not_owned:
 *                 summary: Domain competitors group does not belong to user
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
 *               message: "An unexpected error occurred while retrieving domain competitors group details"
 */
export const getDomainCompetitorsGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication error', message: 'Unauthorized' });
        }

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const group = await DomainCompetitorsRepository.getTaskGroupById(userId, groupId);
        res.json(group);
    } catch (error) {
        console.error('Error retrieving domain competitors group details:', error);
        if ((error as Error).message === 'Group not found' || (error as Error).message === 'Invalid group ID format') {
            return res.status(404).json({ error: 'Not found', message: 'Group not found' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while retrieving domain competitors group details'
        });
    }
};

/**
 * @swagger
 * /api/rank-monitor/domain-analytics/competitors/groups/{groupId}:
 *   delete:
 *     summary: Delete a domain competitors analysis group
 *     description: Delete a specific domain competitors analysis group and all its associated tasks permanently. This action cannot be undone.
 *     tags:
 *       - Rank Monitor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the domain competitors group to delete (format target_location_language_timeWindow)
 *         example: "example.com_2840_en_1234567"
 *     responses:
 *       200:
 *         description: Successfully deleted domain competitors group
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
 *                   example: "Domain competitors group deleted successfully"
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
 *                 summary: Successfully deleted domain competitors group
 *                 value:
 *                   success: true
 *                   message: "Domain competitors group deleted successfully"
 *                   deleted_tasks_count: 2
 *               single_task_deletion:
 *                 summary: Successfully deleted group with single task
 *                 value:
 *                   success: true
 *                   message: "Domain competitors group deleted successfully"
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
 *         description: Not found - Domain competitors group does not exist or does not belong to user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               group_not_found:
 *                 summary: Domain competitors group not found
 *                 value:
 *                   error: "Not found"
 *                   message: "Group not found"
 *               group_not_owned:
 *                 summary: Domain competitors group does not belong to user
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
 *                   message: "An unexpected error occurred while deleting domain competitors group"
 */
export const deleteDomainCompetitorsGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication error', message: 'Unauthorized' });
        }

        const { groupId } = req.params;

        if (!groupId) {
            return res.status(400).json({ error: 'Validation error', message: 'Group ID is required' });
        }

        const deletedCount = await DomainCompetitorsRepository.deleteTaskGroup(userId, groupId);
        res.json({
            success: true,
            message: 'Domain competitors group deleted successfully',
            deleted_tasks_count: deletedCount
        });
    } catch (error) {
        console.error('Error deleting domain competitors group:', error);
        if ((error as Error).message === 'Group not found' || (error as Error).message === 'Invalid group ID format') {
            return res.status(404).json({ error: 'Not found', message: 'Group not found' });
        }
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred while deleting domain competitors group'
        });
    }
};
