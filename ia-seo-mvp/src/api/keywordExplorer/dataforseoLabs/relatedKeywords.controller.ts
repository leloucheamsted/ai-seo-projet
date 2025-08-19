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
