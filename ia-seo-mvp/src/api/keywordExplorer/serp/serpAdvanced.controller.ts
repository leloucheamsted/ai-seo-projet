import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { SerpAdvancedParams } from './params/SerpAdvancedParams';
import { SerpAdvancedResponse } from './interfaces/SerpAdvancedResponse';
import { SerpRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/serp-advanced:
 *   post:
 *     summary: Get advanced SERP analysis for keywords
 *     description: Perform comprehensive SERP (Search Engine Results Page) analysis including organic results, featured snippets, People Also Ask, and other SERP features using DataForSEO SERP API
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SerpAdvancedParams'
 *           examples:
 *             basic_serp_analysis:
 *               summary: Basic SERP analysis
 *               value:
 *                 keywords: ["SEO tools", "keyword research"]
 *                 location_name: "United States"
 *                 language_code: "en"
 *                 device: "desktop"
 *                 depth: 10
 *             advanced_serp_analysis:
 *               summary: Advanced SERP analysis with custom settings
 *               value:
 *                 keywords: ["digital marketing agency"]
 *                 location_code: "2840"
 *                 language_code: "en"
 *                 device: "mobile"
 *                 depth: 20
 *                 se_domain: "google.com"
 *                 group_organic_results: false
 *                 calculate_rectangles: true
 *                 people_also_ask_click_depth: 2
 *                 load_async_ai_overview: true
 *                 browser_screen_width: 375
 *                 browser_screen_height: 812
 *                 tag: "mobile-serp-analysis"
 *             competitor_analysis:
 *               summary: SERP analysis focusing on specific competitor
 *               value:
 *                 keywords: ["project management software"]
 *                 target: "competitor.com"
 *                 location_name: "United Kingdom"
 *                 language_code: "en"
 *                 device: "desktop"
 *                 depth: 30
 *     responses:
 *       200:
 *         description: Advanced SERP data successfully retrieved
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
 *               $ref: '#/components/schemas/SerpAdvancedResponse'
 *             examples:
 *               successful_serp_analysis:
 *                 summary: Successful SERP analysis with organic results
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.25
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 1
 *                       cost: 0.25
 *                       data:
 *                         api: "serp"
 *                         function: "live"
 *                         se: "google"
 *                         keyword: "SEO tools"
 *                         device: "desktop"
 *                       result:
 *                         - keyword: "SEO tools"
 *                           type: "organic"
 *                           se_domain: "google.com"
 *                           location_code: 2840
 *                           language_code: "en"
 *                           check_url: "https://www.google.com/search?q=seo+tools"
 *                           se_results_count: 125000000
 *                           items_count: 10
 *                           item_types: ["organic", "people_also_ask", "related_searches"]
 *                           items:
 *                             - type: "organic"
 *                               rank_group: 1
 *                               rank_absolute: 1
 *                               position: "1"
 *                               domain: "semrush.com"
 *                               title: "Best SEO Tools - Complete Guide"
 *                               url: "https://semrush.com/blog/seo-tools/"
 *                               description: "Discover the best SEO tools for 2025..."
 *                               is_featured_snippet: false
 *                               highlighted: ["SEO", "tools"]
 *                             - type: "people_also_ask"
 *                               title: "What are the best free SEO tools?"
 *                               description: "Free SEO tools include Google Search Console..."
 *               featured_snippet_result:
 *                 summary: SERP with featured snippet
 *                 value:
 *                   tasks:
 *                     - result:
 *                         - items:
 *                             - type: "featured_snippet"
 *                               rank_absolute: 0
 *                               domain: "moz.com"
 *                               title: "What is SEO?"
 *                               description: "SEO stands for Search Engine Optimization..."
 *                               is_featured_snippet: true
 *               no_results:
 *                 summary: No SERP results found
 *                 value:
 *                   tasks:
 *                     - result:
 *                         - se_results_count: 0
 *                           items_count: 0
 *                           items: []
 *       400:
 *         description: Bad request - Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               missing_keywords:
 *                 summary: Missing keywords parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords array is required"
 *               empty_keywords:
 *                 summary: Empty keywords array
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords array cannot be empty"
 *               too_many_keywords:
 *                 summary: Too many keywords
 *                 value:
 *                   error: "Validation error"
 *                   message: "Maximum 100 keywords allowed per request"
 *               invalid_depth:
 *                 summary: Invalid depth parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "depth must be between 1 and 100"
 *               invalid_device:
 *                 summary: Invalid device parameter
 *                 value:
 *                   error: "Validation error"
 *                   message: "device must be 'desktop' or 'mobile'"
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
 *                   message: "DataForSEO SERP API returned an error"
 *               server_error:
 *                 summary: Internal server error
 *                 value:
 *                   error: "Internal server error"
 *                   message: "An unexpected error occurred during SERP analysis"
 *               location_error:
 *                 summary: Invalid location for SERP analysis
 *                 value:
 *                   error: "Location error"
 *                   message: "Invalid location code or location not supported"
 *               search_engine_error:
 *                 summary: Search engine unavailable
 *                 value:
 *                   error: "Search engine error"
 *                   message: "Search engine temporarily unavailable"
 */
export const serpAdvanced = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('SERP', ApiConfig.ENDPOINTS.SERP_LIVE);
        const params = new SerpAdvancedParams(req.body);
        if (!params.keywords || !Array.isArray(params.keywords) || params.keywords.length === 0) {
            return res.status(400).json({ message: 'keywords array is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as SerpAdvancedResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                await SerpRepository.saveSerpTask(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
