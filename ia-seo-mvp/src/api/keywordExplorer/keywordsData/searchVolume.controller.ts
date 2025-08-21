import { Request, Response } from 'express';
import axios from 'axios';
import { ApiConfig } from '../../../config/api.config';
import { KeywordsForKeywordsResponse } from './interfaces/KeywordsForKeywordsResponse';
import { SearchVolumeParams } from './params/SearchVolumeParams';
import { KeywordsForKeywordsRepository } from '../../../repositories/keyword.repository';

/**
 * @swagger
 * /api/keyword-explorer/search-volume:
 *   post:
 *     summary: Get search volume data for keywords
 *     description: Retrieve search volume, competition data, and bid estimates for specified keywords using DataForSEO Search Volume API
 *     tags:
 *       - Keyword Explorer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchVolumeParams'
 *           examples:
 *             basic_volume_check:
 *               summary: Basic search volume analysis
 *               value:
 *                 keywords: ["SEO tools", "keyword research", "digital marketing"]
 *                 location_name: "United States"
 *                 language_code: "en"
 *             advanced_volume_analysis:
 *               summary: Advanced volume analysis with historical data
 *               value:
 *                 keywords: ["content marketing", "social media marketing", "email marketing", "affiliate marketing"]
 *                 location_code: "2840"
 *                 language_code: "en"
 *                 sort_by: "search_volume"
 *                 include_adult_keywords: false
 *                 search_partners: false
 *                 date_from: "2024-01-01"
 *                 date_to: "2024-12-31"
 *                 tag: "marketing-volume-analysis"
 *     responses:
 *       200:
 *         description: Search volume data successfully retrieved
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
 *               $ref: '#/components/schemas/SearchVolumeResponse'
 *             examples:
 *               successful_volume_data:
 *                 summary: Successful search volume response
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.01
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - id: "live_task_12345678-1234-1234-1234-123456789012"
 *                       status_code: 20000
 *                       status_message: "Ok."
 *                       result_count: 3
 *                       cost: 0.01
 *                       data:
 *                         keywords: ["SEO tools", "keyword research", "digital marketing"]
 *                         location_code: 2840
 *                         language_code: "en"
 *                       result:
 *                         - keyword: "SEO tools"
 *                           search_volume: 12000
 *                           competition: 0.65
 *                           competition_index: 65
 *                           low_top_of_page_bid: 1.25
 *                           high_top_of_page_bid: 3.75
 *                           monthly_searches:
 *                             - year: 2025
 *                               month: 7
 *                               search_volume: 11500
 *                             - year: 2025
 *                               month: 8
 *                               search_volume: 12500
 *                         - keyword: "keyword research"
 *                           search_volume: 8500
 *                           competition: 0.72
 *                           competition_index: 72
 *                         - keyword: "digital marketing"
 *                           search_volume: 45000
 *                           competition: 0.58
 *                           competition_index: 58
 *               zero_volume_results:
 *                 summary: Keywords with low/zero search volume
 *                 value:
 *                   version: "0.1.20240801"
 *                   status_code: 20000
 *                   status_message: "Ok."
 *                   cost: 0.01
 *                   tasks_count: 1
 *                   tasks_error: 0
 *                   tasks:
 *                     - result:
 *                         - keyword: "very specific long tail keyword"
 *                           search_volume: 0
 *                           competition: null
 *                           competition_index: null
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
 *                   message: "keywords (array) is required"
 *               empty_keywords:
 *                 summary: Empty keywords array
 *                 value:
 *                   error: "Validation error"
 *                   message: "keywords array cannot be empty"
 *               too_many_keywords:
 *                 summary: Too many keywords
 *                 value:
 *                   error: "Validation error"
 *                   message: "Maximum 1000 keywords allowed per request"
 *               invalid_location:
 *                 summary: Invalid location parameters
 *                 value:
 *                   error: "Validation error"
 *                   message: "Invalid location_code or location_name"
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
 *               quota_exceeded:
 *                 summary: API quota exceeded
 *                 value:
 *                   error: "Quota exceeded"
 *                   message: "Daily API quota limit reached"
 */
export const searchVolume = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const creds = await ApiConfig.getDataForSEOCredentials(userId);
        const url = ApiConfig.getFullUrl('KEYWORDS_DATA', ApiConfig.ENDPOINTS.KEYWORD_GOOGLE_SEARCH_VOLUMES + '/live');
        const params = new SearchVolumeParams(req.body);
        if (!params.keywords || !Array.isArray(params.keywords) || params.keywords.length === 0) {
            return res.status(400).json({ message: 'keywords (array) is required' });
        }
        const response = await axios.post(url, [params], {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64'),
                'Content-Type': 'application/json',
            },
        });

        const responseData = response.data as KeywordsForKeywordsResponse;
        if (responseData.tasks && Array.isArray(responseData.tasks)) {
            for (const task of responseData.tasks) {
                // Add user_id to task before saving
                task.user_id = userId;
                await KeywordsForKeywordsRepository.saveTaskSearchVolume(task, params);
            }
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : error });
    }
};
