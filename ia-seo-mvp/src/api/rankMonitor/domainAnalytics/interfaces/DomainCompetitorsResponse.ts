export interface DomainCompetitorsResponse {
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
            se_type: string;
            target: string;
            intersecting_domains?: string[];
            language_name?: string;
            location_code?: number;
            limit?: number;
            [key: string]: any;
        };
        result: Array<{
            se_type: string;
            target: string;
            location_code: number;
            language_code: string;
            total_count: number;
            items_count: number;
            items: Array<{
                se_type: string;
                domain: string;
                avg_position: number;
                sum_position: number;
                intersections: number;
                full_domain_metrics: {
                    organic: Record<string, number>;
                    paid: Record<string, number>;
                    local_pack: any;
                    featured_snippet: any;
                };
                metrics: {
                    organic: Record<string, number>;
                    paid: Record<string, number>;
                    local_pack: any;
                    featured_snippet: any;
                };
                competitor_metrics: {
                    organic: Record<string, number>;
                    paid: Record<string, number>;
                    local_pack: any;
                    featured_snippet: any;
                };
            }>;
        }>;
    }>;
}
