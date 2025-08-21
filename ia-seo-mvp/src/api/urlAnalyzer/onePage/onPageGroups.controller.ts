import { Request, Response } from 'express';
import { OnPageRepository } from '../../../repositories/onPage.repository';

/**
 * @swagger
 * /api/url-analyzer/onpage/groups:
 *   get:
 *     summary: Retrieve OnPage analysis groups
 *     description: Get paginated list of OnPage analysis task groups. Tasks are grouped by similar parameters (target URL, max_crawl_pages) and creation time windows (5-minute intervals). Only includes tasks where is_search_volume is not true.
 *     tags:
 *       - OnPage Analyzer
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
 *         description: Successfully retrieved OnPage analysis groups
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
 *               $ref: '#/components/schemas/OnPageGroupsResponse'
 *             examples:
 *               success:
 *                 summary: Successful OnPage groups retrieval
 *                 value:
 *                   groups:
 *                     - group_id: "https://example.com_100_1234567"
 *                       group_params:
 *                         target: "https://example.com"
 *                         max_crawl_pages: 100
 *                         max_crawl_depth: 3
 *                         enable_javascript: true
 *                         enable_content_parsing: true
 *                         is_search_volume: false
 *                       created_at: "2024-01-15T10:30:00.000Z"
 *                       tasks_count: 2
 *                       total_results: 0
 *                       total_cost: 0.2
 *                   pagination:
 *                     current_page: 1
 *                     per_page: 10
 *                     total_items: 25
 *                     total_pages: 3
 *                     has_next_page: true
 *                     has_prev_page: false
 *       400:
 *         description: Bad request - invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_pagination:
 *                 summary: Invalid pagination parameters
 *                 value:
 *                   message: "Page must be a positive integer"
 *                   error_code: "INVALID_PAGINATION"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Missing or invalid authentication token
 *                 value:
 *                   message: "Unauthorized"
 *                   error_code: "UNAUTHORIZED"
 *       429:
 *         description: Too many requests
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
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rate_limit:
 *                 summary: Rate limit exceeded
 *                 value:
 *                   message: "Rate limit exceeded"
 *                   error_code: "RATE_LIMIT_EXCEEDED"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   message: "Internal server error"
 *                   error_code: "INTERNAL_ERROR"
 */
export const getOnPageGroups = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Validation des paramètres de pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (page < 1) {
            return res.status(400).json({
                message: 'Page must be a positive integer',
                error_code: 'INVALID_PAGINATION'
            });
        }

        if (limit < 1 || limit > 100) {
            return res.status(400).json({
                message: 'Limit must be between 1 and 100',
                error_code: 'INVALID_PAGINATION'
            });
        }

        const result = await OnPageRepository.getTasksByGroups(userId, page, limit);
        res.json(result);

    } catch (error) {
        console.error('Error fetching OnPage groups:', error);
        res.status(500).json({
            message: 'Internal server error',
            error_code: 'INTERNAL_ERROR'
        });
    }
};

/**
 * @swagger
 * /api/url-analyzer/onpage/groups/{groupId}:
 *   get:
 *     summary: Retrieve specific OnPage analysis group by ID
 *     description: Get detailed information about a specific OnPage analysis group including all tasks within the group. The group ID format is target_maxCrawlPages_timeWindow (e.g., https://example.com_100_1234567).
 *     tags:
 *       - OnPage Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group identifier (format target_maxCrawlPages_timeWindow)
 *         example: "https://example.com_100_1234567"
 *     responses:
 *       200:
 *         description: Successfully retrieved OnPage analysis group details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OnPageGroup'
 *             examples:
 *               success:
 *                 summary: Successful group retrieval
 *                 value:
 *                   group_id: "https://example.com_100_1234567"
 *                   group_params:
 *                     target: "https://example.com"
 *                     max_crawl_pages: 100
 *                     max_crawl_depth: 3
 *                     enable_javascript: true
 *                     enable_content_parsing: true
 *                     is_search_volume: false
 *                   created_at: "2024-01-15T10:30:00.000Z"
 *                   tasks_count: 2
 *                   total_results: 0
 *                   total_cost: 0.2
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       user_id: 1
 *                       status_code: 20100
 *                       status_message: "Task Created."
 *                       time: "2024-01-15 10:30:15 +00:00"
 *                       cost: 0.1
 *                       result_count: 0
 *                       result: null
 *       400:
 *         description: Bad request - invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_group_id:
 *                 summary: Invalid group ID format
 *                 value:
 *                   message: "Invalid group ID format"
 *                   error_code: "INVALID_GROUP_ID"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Missing or invalid authentication token
 *                 value:
 *                   message: "Unauthorized"
 *                   error_code: "UNAUTHORIZED"
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_found:
 *                 summary: Group not found
 *                 value:
 *                   message: "Group not found"
 *                   error_code: "GROUP_NOT_FOUND"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   message: "Internal server error"
 *                   error_code: "INTERNAL_ERROR"
 */
export const getOnPageGroupById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized',
                error_code: 'UNAUTHORIZED'
            });
        }

        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({
                message: 'Group ID is required',
                error_code: 'MISSING_GROUP_ID'
            });
        }

        try {
            const result = await OnPageRepository.getTaskGroupById(userId, groupId);
            res.json(result);
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Invalid group ID format') {
                    return res.status(400).json({
                        message: 'Invalid group ID format',
                        error_code: 'INVALID_GROUP_ID'
                    });
                }
                if (error.message === 'Group not found') {
                    return res.status(404).json({
                        message: 'Group not found',
                        error_code: 'GROUP_NOT_FOUND'
                    });
                }
            }
            throw error;
        }

    } catch (error) {
        console.error('Error fetching OnPage group by ID:', error);
        res.status(500).json({
            message: 'Internal server error',
            error_code: 'INTERNAL_ERROR'
        });
    }
};

/**
 * @swagger
 * /api/url-analyzer/onpage/groups/{groupId}:
 *   delete:
 *     summary: Delete specific OnPage analysis group
 *     description: Delete all OnPage analysis tasks within a specific group. This action is irreversible and will permanently remove all associated task data.
 *     tags:
 *       - OnPage Analyzer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: Group identifier (format target_maxCrawlPages_timeWindow)
 *         example: "https://example.com_100_1234567"
 *     responses:
 *       200:
 *         description: Successfully deleted OnPage analysis group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message
 *                 deleted_count:
 *                   type: integer
 *                   description: Number of tasks deleted
 *                   minimum: 0
 *               required:
 *                 - message
 *                 - deleted_count
 *             examples:
 *               success:
 *                 summary: Successful group deletion
 *                 value:
 *                   message: "OnPage analysis group deleted successfully"
 *                   deleted_count: 3
 *       400:
 *         description: Bad request - invalid group ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_group_id:
 *                 summary: Invalid group ID format
 *                 value:
 *                   message: "Invalid group ID format"
 *                   error_code: "INVALID_GROUP_ID"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               unauthorized:
 *                 summary: Missing or invalid authentication token
 *                 value:
 *                   message: "Unauthorized"
 *                   error_code: "UNAUTHORIZED"
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               not_found:
 *                 summary: Group not found
 *                 value:
 *                   message: "Group not found"
 *                   error_code: "GROUP_NOT_FOUND"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   message: "Internal server error"
 *                   error_code: "INTERNAL_ERROR"
 */
export const deleteOnPageGroup = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                message: 'Unauthorized',
                error_code: 'UNAUTHORIZED'
            });
        }

        const groupId = req.params.groupId;
        if (!groupId) {
            return res.status(400).json({
                message: 'Group ID is required',
                error_code: 'MISSING_GROUP_ID'
            });
        }

        try {
            const deletedCount = await OnPageRepository.deleteTaskGroup(userId, groupId);
            res.json({
                message: 'OnPage analysis group deleted successfully',
                deleted_count: deletedCount
            });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Invalid group ID format') {
                    return res.status(400).json({
                        message: 'Invalid group ID format',
                        error_code: 'INVALID_GROUP_ID'
                    });
                }
                if (error.message === 'Group not found') {
                    return res.status(404).json({
                        message: 'Group not found',
                        error_code: 'GROUP_NOT_FOUND'
                    });
                }
            }
            throw error;
        }

    } catch (error) {
        console.error('Error deleting OnPage group:', error);
        res.status(500).json({
            message: 'Internal server error',
            error_code: 'INTERNAL_ERROR'
        });
    }
};
