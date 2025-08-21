import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { KeywordsForSiteParams } from './params/KeywordsForSiteParams';
import { KeywordsForSiteLiveResponse } from './interfaces/KeywordsForSiteLiveResponse';
import { KeywordsForSiteRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/keywords-for-site:
 *   post:
 *     summary: Get keywords for a specific site or domain
 *     description: Retrieve keyword data for a target domain or URL using DataForSEO Keywords Data API
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/KeywordsForSiteParams'
 *           examples:
 *             domain_analysis:
 *               summary: Analyze keywords for a domain
 *               value:
 *                 target: "example.com"
 *                 target_type: "domain"
 *                 location_name: "United States"
 *                 language_code: "en"
 *                 sort_by: "search_volume"
 *             url_analysis:
 *               summary: Analyze keywords for a specific URL
 *               value:
 *                 target: "https://example.com/blog/seo-guide"
 *                 target_type: "url"
 *                 location_code: "2840"
 *                 language_code: "en"
 *                 include_adult_keywords: false
 *                 date_from: "2024-01-01"
 *                 date_to: "2024-12-31"
 *     responses:
 *       200:
 *         description: Site keywords successfully retrieved
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
 *               $ref: '#/components/schemas/KeywordsForSiteLiveResponse'
 *             examples:
 *               successful_analysis:
 *                 summary: Successful site keyword analysis
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.02
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 25
 *                       data:
 *                         target: "example.com"
 *                         location_code: 2840
 *                         language_code: "en"
 *                       result:
 *                         - keyword: "SEO tools"
 *                           search_volume: 8500
 *                           competition: "MEDIUM"
 *                           competition_index: 65
 *                           low_top_of_page_bid: 1.15
 *                           high_top_of_page_bid: 3.25
 *                         - keyword: "keyword research"
 *                           search_volume: 5200
 *                           competition: "HIGH"
 *                           competition_index: 78
 *               empty_results:
 *                 summary: No keywords found for target
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.02
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 0
 *                       result: []
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_target:
 *                 summary: Missing target parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "target is required"
 *               invalid_target:
 *                 summary: Invalid target format
 *                 value:
 *                   error: "Validation error"
 *                   message: "target must be a valid domain or URL"
 *               invalid_target_type:
 *                 summary: Invalid target type
 *                 value:
 *                   error: "Validation error"
 *                   message: "target_type must be 'domain' or 'url'"
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
 *               target_not_found:
 *                 summary: Target domain/URL not accessible
 *                 value:
 *                   error: "Target error"
 *                   message: "Target domain or URL is not accessible"
 */
export const keywordsForSite = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_FORSITE + '/live');
        const params = new KeywordsForSiteParams(req.body);
        if (!params.target) {
            return res.status(400).json({ message: 'target is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForSiteLiveResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                // Add user_id to task before saving
                (task as any).user_id = userId;
                await KeywordsForSiteRepository.savekeywordForSiteTask(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
