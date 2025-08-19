import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { Domain } from 'domain';
import { DomainCompetitorsResponse } from './interfaces/DomainCompetitorsResponse';
import { DomainCompetitorsParams } from './params/DomainCompetitorsParams';
import { DomainCompetitorsRepository } from '../../../repositories/rankMonitor.repository';

/**
 * @swagger
 * /api/rank-monitor/domain-analytics/competitors:
 *   post:
 *     summary: Get domain competitors analysis from DataForSEO Labs
 *     description: Analyze domain competitors to identify competing websites that rank for similar keywords. This endpoint provides comprehensive competitor analysis including intersection keywords, ranking positions, and traffic metrics.
 *     tags:
 *       - Rank Monitor
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DomainCompetitorsParams'
 *           examples:
 *             basic_analysis:
 *               summary: Basic competitor analysis
 *               description: Analyze competitors for a domain with default settings
 *               value:
 *                 target: "example.com"
 *                 location_name: "United States"
 *                 language_name: "English"
 *                 limit: 50
 *             advanced_analysis:
 *               summary: Advanced competitor analysis with filters
 *               description: Detailed competitor analysis with specific search types and filters
 *               value:
 *                 target: "example.com"
 *                 location_code: 2840
 *                 language_code: "en"
 *                 item_types: ["organic", "paid"]
 *                 include_clickstream_data: true
 *                 limit: 100
 *                 max_rank_group: 20
 *                 order_by: ["intersections.desc"]
 *                 exclude_top_domains: false
 *                 ignore_synonyms: false
 *                 tag: "competitor-analysis"
 *             filtered_analysis:
 *               summary: Filtered competitor analysis
 *               description: Competitor analysis with specific intersection requirements
 *               value:
 *                 target: "mywebsite.com"
 *                 location_name: "United Kingdom"
 *                 language_name: "English"
 *                 item_types: ["organic"]
 *                 limit: 25
 *                 filters: [
 *                   ["intersections", ">", 10]
 *                 ]
 *                 intersecting_domains: ["competitor1.com", "competitor2.com"]
 *     responses:
 *       200:
 *         description: Domain competitors analysis successful
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
 *             description: The time at which the current rate limit window resets in UTC epoch seconds
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
 *               $ref: '#/components/schemas/DomainCompetitorsResponse'
 *             examples:
 *               successful_response:
 *                 summary: Successful competitor analysis
 *                 description: Example of a successful domain competitor analysis
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   time: "2024-03-15T10:30:00.000Z"
 *                   cost: 0.12
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       time: "2024-03-15T10:30:00.000Z"
 *                       cost: 0.12
 *                       result_count: 1
 *                       path: ["v3", "domain_analytics", "google", "competitors", "live"]
 *                       data:
 *                         api: "domain_analytics"
 *                         function: "competitors"
 *                         se_type: "google"
 *                         target: "example.com"
 *                         location_code: 2840
 *                         language_name: "English"
 *                         limit: 50
 *                       result:
 *                         - se_type: "google"
 *                           target: "example.com"
 *                           location_code: 2840
 *                           language_code: "en"
 *                           total_count: 1250
 *                           items_count: 50
 *                           items:
 *                             - se_type: "google"
 *                               domain: "competitor1.com"
 *                               avg_position: 15.4
 *                               sum_position: 1540
 *                               intersections: 100
 *                               full_domain_metrics:
 *                                 organic:
 *                                   pos_1: 15
 *                                   pos_2_3: 23
 *                                   pos_4_10: 65
 *                                   pos_11_20: 45
 *                                   pos_21_30: 32
 *                                   pos_31_40: 18
 *                                   pos_41_50: 12
 *                                   pos_51_100: 25
 *                                   etv: 15420.50
 *                                   count: 235
 *                                   estimated_paid_traffic_cost: 25680.75
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
 *               invalid_target:
 *                 summary: Invalid target domain
 *                 description: Error when target domain is not provided or invalid
 *                 value:
 *                   error: "Target domain is required and must be a valid domain"
 *                   code: "INVALID_TARGET"
 *                   details: "The target parameter must be a valid domain name"
 *               invalid_location:
 *                 summary: Invalid location parameter
 *                 description: Error when location parameters are invalid
 *                 value:
 *                   error: "Invalid location parameters"
 *                   code: "INVALID_LOCATION"
 *                   details: "Either location_name or location_code must be provided"
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
 *                   error: "Internal server error occurred while processing domain competitors analysis"
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
export const domainCompetitors = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('DOMAIN_ANALYTICS', ApiConfig.ENDPOINTS.DataForSEO_KEYWORD_GOOGLE_COMPETITORS + '/live');
        const params = new DomainCompetitorsParams(req.body);
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as DomainCompetitorsResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await DomainCompetitorsRepository.saveDomainCompetitorsTask(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
