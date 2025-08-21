import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { DomainRankOverviewResponse } from './interfaces/DomainRankOverviewResponse';
import { DomainRankOverviewParams } from './params/DomainRankOverviewParams';
import { DomainRankOverviewRepository } from '../../../repositories/domainRankOverview.repository';

/**
 * @swagger
 * /api/url-analyzer/domain-analytics/rank-overview:
 *   post:
 *     summary: Get domain rank overview analysis
 *     description: Analyze domain ranking performance across different positions and search engine result pages. This endpoint provides comprehensive metrics including keyword distribution by ranking positions, estimated traffic value, and ranking trends for both organic and paid search results.
 *     tags:
 *       - URL Analyzer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DomainRankOverviewParams'
 *           examples:
 *             basic_overview:
 *               summary: Basic domain rank overview
 *               description: Simple domain ranking analysis for a website
 *               value:
 *                 target: "example.com"
 *                 location_name: "United States"
 *                 language_name: "English"
 *                 limit: 100
 *             advanced_overview:
 *               summary: Advanced domain rank overview with filters
 *               description: Detailed domain analysis with specific parameters
 *               value:
 *                 target: "mywebsite.com"
 *                 location_code: 2840
 *                 language_code: "en"
 *                 ignore_synonyms: true
 *                 limit: 500
 *                 offset: 0
 *                 tag: "domain-performance-analysis"
 *             competitive_analysis:
 *               summary: Competitive domain analysis
 *               description: Domain analysis for competitive intelligence
 *               value:
 *                 target: "competitor.com"
 *                 location_name: "United Kingdom"
 *                 language_name: "English"
 *                 ignore_synonyms: false
 *                 limit: 1000
 *                 tag: "competitor-rank-analysis"
 *     responses:
 *       200:
 *         description: Domain rank overview analysis completed successfully
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
 *               $ref: '#/components/schemas/DomainRankOverviewResponse'
 *             examples:
 *               successful_overview:
 *                 summary: Successful domain rank overview
 *                 description: Example of successful domain ranking analysis
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:30:00.000Z"
 *                   cost: 0.08
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-03-15T10:30:00.000Z"
 *                       cost: 0.08
 *                       result_count: 1
 *                       path: ["v3", "dataforseo_labs", "google", "domain_rank_overview", "live"]
 *                       data:
 *                         api: "dataforseo_labs"
 *                         function: "domain_rank_overview"
 *                         se: "google"
 *                         target: "example.com"
 *                         location_code: 2840
 *                         language_code: "en"
 *                       result:
 *                         - se_type: "google"
 *                           target: "example.com"
 *                           location_code: 2840
 *                           language_code: "en"
 *                           total_count: 1500
 *                           items_count: 1
 *                           items:
 *                             - se_type: "google"
 *                               location_code: 2840
 *                               language_code: "en"
 *                               metrics:
 *                                 organic:
 *                                   pos_1: 15
 *                                   pos_2_3: 23
 *                                   pos_4_10: 65
 *                                   pos_11_20: 45
 *                                   pos_21_30: 32
 *                                   pos_31_40: 18
 *                                   pos_41_50: 12
 *                                   pos_51_60: 8
 *                                   etv: 15420.50
 *                                   count: 235
 *                                   estimated_paid_traffic_cost: 25680.75
 *                                   is_new: 5
 *                                   is_up: 12
 *                                   is_down: 8
 *                                   is_lost: 3
 *                                 paid:
 *                                   pos_1: 5
 *                                   pos_2_3: 8
 *                                   pos_4_10: 12
 *                                   etv: 5420.30
 *                                   count: 25
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
 *               missing_target:
 *                 summary: Missing target domain
 *                 description: Error when target domain is not provided
 *                 value:
 *                   error: "Target domain is required"
 *                   code: "MISSING_TARGET"
 *                   details: "The target parameter is required for domain rank overview analysis"
 *               invalid_domain:
 *                 summary: Invalid domain format
 *                 description: Error when domain format is invalid
 *                 value:
 *                   error: "Invalid domain format"
 *                   code: "INVALID_DOMAIN"
 *                   details: "Domain should not include protocol (https://) or www prefix"
 *               invalid_limit:
 *                 summary: Invalid limit parameter
 *                 description: Error when limit exceeds maximum allowed value
 *                 value:
 *                   error: "Limit parameter out of range"
 *                   code: "INVALID_LIMIT"
 *                   details: "Limit must be between 1 and 1000"
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
 *               invalid_token:
 *                 summary: Invalid authentication token
 *                 description: Error when authentication token is invalid or expired
 *                 value:
 *                   error: "Invalid authentication token"
 *                   code: "INVALID_AUTH"
 *                   details: "The provided authentication token is invalid or expired"
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
 *                   error: "Internal server error occurred while processing domain rank overview"
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
export const domainRankOverview = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('DATAFORSEO_LABS', ApiConfig.ENDPOINTS.DataForSEO_KEYWORD_GOOGLE_DOMAIN_RANK + '/live');
        const params = new DomainRankOverviewParams(req.body);

        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as DomainRankOverviewResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await DomainRankOverviewRepository.saveDomainRankOverviewTask(task, params, userId);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
