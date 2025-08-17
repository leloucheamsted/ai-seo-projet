export interface OnPageTaskGetResponse {
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
        };
        result: Array<{
            domain_info: {
                name: string;
                cms?: string;
                ip?: string;
                server?: string;
                crawl_start?: string;
                crawl_end?: string;
                crawl_progress?: string;
                ssl_info?: {
                    valid_certificate: boolean;
                    certificate_issuer?: string;
                    certificate_subject?: string;
                    certificate_version?: number;
                    certificate_hash?: string;
                    certificate_expiration_date?: string;
                };
                checks?: Record<string, boolean | number | string>;
                total_pages?: number;
                page_not_found_status_code?: number;
                canonicalization_status_code?: number;
                directory_browsing_status_code?: number;
                main_domain?: string;
            };
            page_metrics: {
                links_external?: number;
                links_internal?: number;
                duplicate_title?: number;
                duplicate_description?: number;
                duplicate_content?: number;
                broken_links?: number;
                broken_resources?: number;
                checks?: Record<string, number>;
            };
        }>;
    }>;
}
