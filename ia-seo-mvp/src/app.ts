import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

// Import middlewares
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware';

// Import controllers
// Les autres contrôleurs seront ajoutés au fur et à mesure

// Import utils
import { logger } from './utils/logger';
import { ApiConfig } from './config/api.config';
import { swaggerSpec, swaggerOptions } from './config/swagger.config';
import authController from './api/auth.controller';

// Load environment variables
dotenv.config();

class App {
    // Controller imports for documented endpoints
    private relatedKeywords = require('./api/keywordExplorer/dataforseoLabs/relatedKeywords.controller').relatedKeywords;
    private onPageTaskPost = require('./api/urlAnalyzer/onePage/onPage.controller').onPageTaskPost;
    private onPageTasksReady = require('./api/urlAnalyzer/onePage/onPage.controller').onPageTasksReady;
    private onPageTaskGet = require('./api/urlAnalyzer/onePage/onPage.controller').onPageTaskGet;
    private domainRankOverview = require('./api/urlAnalyzer/domainAnalysis/domainAnalytics.controller').domainRankOverview;
    private contentAnalysisSummaryLive = require('./api/urlAnalyzer/contentsAnalysis/contentAnalysis.controller').contentAnalysisSummaryLive;
    private serpTaskPost = require('./api/rankMonitor/serp/serp.controller').serpTaskPost;
    private serpTaskGet = require('./api/rankMonitor/serp/serp.controller').serpTaskGet;
    private domainCompetitors = require('./api/rankMonitor/domainAnalytics/competitors.controller').domainCompetitors;

    private postKeywordsForKeywords = require('./api/keywordExplorer/keywordsData/keywordsForKeywords.controller').postKeywordsForKeywords;
    private getKeywordsForKeywords = require('./api/keywordExplorer/keywordsData/keywordsForKeywords.controller').getKeywordsForKeywords;
    private readyKeywordsForKeywords = require('./api/keywordExplorer/keywordsData/keywordsForKeywords.controller').readyKeywordsForKeywords;
    private liveKeywordsForKeywords = require('./api/keywordExplorer/keywordsData/keywordsForKeywords.controller').liveKeywordsForKeywords;

    private keywordForSite = require('./api/keywordExplorer/keywordsData/keywordForSite.controller').keywordForSite;
    private serpAdvanced = require('./api/keywordExplorer/serp/serpAdvanced.controller').serpAdvanced;
    private searchVolume = require('./api/keywordExplorer/keywordsData/searchVolume.controller').searchVolume;

    public app: Application;
    private readonly PORT: number;

    constructor() {
        this.app = express();
        this.PORT = parseInt(process.env.API_PORT || '3000');

        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
        this.validateConfiguration();
    }

    /**
     * Initialize global middlewares
     */
    private initializeMiddlewares(): void {
        // Security middlewares
        this.app.use(helmet({
            contentSecurityPolicy: false, // Disable for API
            crossOriginEmbedderPolicy: false,
        }));

        // CORS configuration
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        }));

        // Compression
        this.app.use(compression());

        // Body parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

        // Global rate limiting
        const globalRateLimit = rateLimit({
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requests per window
            message: {
                error: 'Too many requests from this IP, please try again later.',
                retryAfter: '15 minutes',
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        this.app.use('/api/', globalRateLimit);

        // Request logging
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const start = Date.now();

            res.on('finish', () => {
                const duration = Date.now() - start;
                logger.info(
                    `Request completed: ${req.method} ${req.originalUrl} - ${res.statusCode} in ${duration}ms`,
                    {
                        method: req.method,
                        url: req.url,
                        status: res.statusCode,
                        duration: `${duration}ms`,
                        ip: req.ip,
                        userAgent: req.get('user-agent'),
                    });
            });

            next();
        });

        // API usage tracking middleware
        this.app.use('/api/', rateLimitMiddleware);
    }

    /**
     * Initialize routes
     */
    private initializeRoutes(): void {
        // Swagger documentation
        this.app.use('/api/docs', swaggerUi.serve);
        this.app.get('/api/docs', swaggerUi.setup(swaggerSpec, swaggerOptions));

        // Swagger JSON endpoint
        this.app.get('/api/docs.json', (req: Request, res: Response) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });

        // Health check
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                environment: process.env.NODE_ENV || 'development',
            });
        });

        // API info
        this.app.get('/api', (req: Request, res: Response) => {
            res.status(200).json({
                name: 'IA SEO MVP API',
                version: '1.0.0',
                description: 'API for SEO analysis with DataForSEO integration',
                endpoints: {
                    auth: '/api/auth',
                    dashboard: '/api/dashboard',
                    taskCosts: '/api/task-costs',
                    keywordExplorer: '/api/keyword-explorer',
                    urlAnalyzer: '/api/url-analyzer',
                    rankMonitor: '/api/rank-monitor',
                    settings: '/api/settings',
                },
                documentation: '/api/docs',
            });
        });

        // Authentication routes (public)
        this.app.use('/api/auth', authController);

        // Dashboard routes (secured)
        this.app.use('/api/dashboard', require('./api/dashboard.routes').default);

        // Task costs routes (secured)
        this.app.use('/api/task-costs', require('./api/taskCosts.controller').default);


        // Settings routes (secured)
        this.app.get('/api/settings/dataforseo', authMiddleware, require('./api/settings.controller').getDataForSEOCredentials);
        this.app.post('/api/settings/dataforseo', authMiddleware, require('./api/settings.controller').setDataForSEOCredentials);

        // Keyword Explorer routes
        this.app.post('/api/keyword-explorer/related-keywords', authMiddleware, this.relatedKeywords);
        this.app.post('/api/keyword-explorer/keywords-for-keywords', authMiddleware, this.postKeywordsForKeywords);
        this.app.post('/api/keyword-explorer/keyword-for-site', authMiddleware, this.keywordForSite);
        this.app.post('/api/keyword-explorer/search-volume', authMiddleware, this.searchVolume);
        this.app.post('/api/keyword-explorer/serp-advanced', authMiddleware, this.serpAdvanced);
        this.app.post('/api/keyword-explorer/ready-keywords-for-keywords', authMiddleware, this.readyKeywordsForKeywords);
        this.app.post('/api/keyword-explorer/live-keywords-for-keywords', authMiddleware, this.liveKeywordsForKeywords);
        this.app.get('/api/keyword-explorer/keywords-for-keywords', authMiddleware, this.getKeywordsForKeywords);

        // OnPage Analyzer routes
        this.app.post('/api/url-analyzer/onpage/task_post', authMiddleware, this.onPageTaskPost);
        this.app.post('/api/url-analyzer/onpage/tasks_ready', authMiddleware, this.onPageTasksReady);
        this.app.get('/api/url-analyzer/onpage/task_get/:id', authMiddleware, this.onPageTaskGet);

        // Domain Analytics routes
        this.app.post('/api/url-analyzer/domain-analytics/rank-overview', authMiddleware, this.domainRankOverview);

        // Content Analysis routes
        this.app.post('/api/url-analyzer/content-analysis/summary-live', authMiddleware, this.contentAnalysisSummaryLive);

        // SERP routes
        this.app.post('/api/rank-monitor/serp/task_post', authMiddleware, this.serpTaskPost);
        this.app.get('/api/rank-monitor/serp/task_get/:id', authMiddleware, this.serpTaskGet);

        // Competitors routes
        this.app.post('/api/rank-monitor/domain-analytics/competitors', authMiddleware, this.domainCompetitors);


        // 404 handler
        this.app.use('*', (req: Request, res: Response) => {
            res.status(404).json({
                error: 'Route not found',
                message: `Cannot ${req.method} ${req.originalUrl}`,
                availableRoutes: [
                    'GET /health',
                    'GET /api',
                    'POST /api/auth/login',
                    'POST /api/auth/register',
                    'GET /api/keyword-explorer',
                    'GET /api/url-analyzer',
                    'GET /api/rank-monitor',
                ],
            });
        });
    }

    /**
     * Initialize error handling
     */
    private initializeErrorHandling(): void {
        this.app.use(errorMiddleware);
    }

    /**
     * Validate application configuration
     */
    private validateConfiguration(): void {
        const configValidation = ApiConfig.validateConfig();

        if (!configValidation.isValid) {
            logger.error('Configuration validation failed:', configValidation.errors);

            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            } else {
                logger.warn('Running in development mode with invalid configuration');
            }
        } else {
            logger.info('Configuration validation passed');
        }
    }

    /**
     * Start the server
     */
    public listen(): void {
        this.app.listen(this.PORT, () => {
            logger.info(`🚀 Server running on port ${this.PORT}`);
            logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`🔗 Health check: http://localhost:${this.PORT}/health`);
            logger.info(`📖 API info: http://localhost:${this.PORT}/api`);
        });
    }

    /**
     * Graceful shutdown
     */
    public shutdown(): void {
        logger.info('🛑 Graceful shutdown initiated');

        // Close any open connections, cleanup resources, etc.
        process.exit(0);
    }
}

export default App;