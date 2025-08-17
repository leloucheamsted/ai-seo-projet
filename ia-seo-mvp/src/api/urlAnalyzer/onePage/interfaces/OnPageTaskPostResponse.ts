export interface OnPageTaskPostResponse {
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
            target: string;
            max_crawl_pages: number;
            [key: string]: any;
        };
        result: any;
    }>;
}
