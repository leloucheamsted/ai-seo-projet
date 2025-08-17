export interface ContentAnalysisSummaryLiveResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: Array<{
        id: string;
        status_code: number;
        status_message: string;
        time: string;
        cost: number;
        result_count: number;
        path: string[];
        data: {
            api: string;
            function: string;
            keyword: string;
            search_mode?: string;
            page_type?: string[];
            internal_list_limit?: number;
            positive_connotation_threshold?: number;
        };
        result: Array<{
            type: string;
            total_count: number;
            rank: number;
            top_domains: Array<{
                domain: string;
                count: number;
            }>;
            sentiment_connotations: Record<string, number>;
            connotation_types: Record<string, number>;
            text_categories: Array<{
                category: number[] | null;
                count: number;
            }>;
            page_categories: Array<{
                category: number[] | null;
                count: number;
            }>;
            page_types: Record<string, number>;
            countries: Record<string, number>;
            languages: Record<string, number>;
        }>;
    }>;
}
