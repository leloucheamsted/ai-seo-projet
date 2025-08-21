import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { ContentAnalysisSummaryLiveParams } from './params/ContentAnalysisSummaryLiveParams';
import { ContentAnalysisSummaryLiveResponse } from './interfaces/ContentAnalysisSummaryLiveResponse';
import { ContentAnalysisSummaryRepository } from '../../../repositories/urlAudit.repository';

/**
 * @swagger
 * /api/url-analyzer/content-analysis/summary-live:
 *   post:
 *     summary: Get live content analysis summary
 *     description: Analyze content sentiment and characteristics for a given keyword across various page types. This endpoint provides comprehensive content analysis including sentiment connotations, page type distribution, and top performing domains.
 *     tags:
 *       - URL Analyzer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentAnalysisSummaryLiveParams'
 *           examples:
 *             basic_analysis:
 *               summary: Basic content analysis
 *               description: Simple content analysis for a keyword
 *               value:
 *                 keyword: "SEO optimization techniques"
 *                 page_type: ["blogs", "news"]
 *                 internal_list_limit: 100
 *             advanced_analysis:
 *               summary: Advanced content analysis with thresholds
 *               description: Detailed content analysis with sentiment thresholds
 *               value:
 *                 keyword: "digital marketing strategies"
 *                 page_type: ["blogs", "news", "organization"]
 *                 internal_list_limit: 200
 *                 positive_connotation_threshold: 0.7
 *                 sentiments_connotation_threshold: 0.6
 *                 rank_scale: "one_hundred"
 *                 tag: "marketing-content-analysis"
 *             ecommerce_analysis:
 *               summary: E-commerce content analysis
 *               description: Content analysis focused on e-commerce and commercial content
 *               value:
 *                 keyword: "best laptops 2024"
 *                 page_type: ["ecommerce", "blogs"]
 *                 internal_list_limit: 150
 *                 positive_connotation_threshold: 0.8
 *                 keyword_fields:
 *                   category: "technology"
 *                   intent: "commercial"
 *     responses:
 *       200:
 *         description: Content analysis summary completed successfully
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
 *               $ref: '#/components/schemas/ContentAnalysisSummaryLiveResponse'
 *             examples:
 *               successful_analysis:
 *                 summary: Successful content analysis
 *                 description: Example of successful content analysis results
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:30:00.000Z"
 *                   cost: 0.05
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-03-15T10:30:00.000Z"
 *                       cost: 0.05
 *                       result_count: 1
 *                       path: ["v3", "content_analysis", "summary", "live"]
 *                       data:
 *                         api: "content_analysis"
 *                         function: "summary"
 *                         keyword: "SEO optimization techniques"
 *                         page_type: ["blogs", "news"]
 *                         internal_list_limit: 100
 *                         positive_connotation_threshold: 0.7
 *                       result:
 *                         - type: "summary"
 *                           total_count: 500
 *                           rank: 15
 *                           top_domains:
 *                             - domain: "moz.com"
 *                               count: 25
 *                             - domain: "searchengineland.com"
 *                               count: 20
 *                           sentiment_connotations:
 *                             positive: 0.65
 *                             negative: 0.25
 *                             neutral: 0.10
 *                           connotation_types:
 *                             informational: 0.4
 *                             commercial: 0.3
 *                             navigational: 0.2
 *                             transactional: 0.1
 *                           page_types:
 *                             blogs: 0.45
 *                             news: 0.30
 *                             organization: 0.25
 *                           countries:
 *                             US: 0.6
 *                             UK: 0.2
 *                             CA: 0.2
 *                           languages:
 *                             en: 0.9
 *                             es: 0.1
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
 *               missing_keyword:
 *                 summary: Missing required keyword
 *                 description: Error when keyword parameter is not provided
 *                 value:
 *                   error: "keywords is required"
 *                   code: "MISSING_KEYWORD"
 *                   details: "The keyword parameter is required for content analysis"
 *               invalid_page_type:
 *                 summary: Invalid page type
 *                 description: Error when page_type contains invalid values
 *                 value:
 *                   error: "Invalid page type"
 *                   code: "INVALID_PAGE_TYPE"
 *                   details: "Page type must be one of: ecommerce, news, blogs, message-boards, organization"
 *               invalid_threshold:
 *                 summary: Invalid threshold value
 *                 description: Error when threshold values are out of range
 *                 value:
 *                   error: "Invalid threshold value"
 *                   code: "INVALID_THRESHOLD"
 *                   details: "Threshold values must be between 0 and 1"
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
 *                   error: "Internal server error occurred while processing content analysis"
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
export const contentAnalysisSummaryLive = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('CONTENT_ANALYSIS', ApiConfig.ENDPOINTS.CONTENT_SENTIMENT + '/live');
        const params = new ContentAnalysisSummaryLiveParams(req.body);
        if (!params.keyword) {
            return res.status(400).json({ message: 'keywords is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as ContentAnalysisSummaryLiveResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                // Add user_id to task before saving
                (task as any).user_id = userId;
                await ContentAnalysisSummaryRepository.saveContentAnalysisSummaryTask(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
