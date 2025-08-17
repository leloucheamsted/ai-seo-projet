// TypeScript interface for the response of SERP task_post endpoint
export interface SerpTaskPostResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: SerpTaskPostTask[];
}

export interface SerpTaskPostTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: SerpTaskPostTaskData;
    result: null;
}

export interface SerpTaskPostTaskData {
    api: string;
    function: string;
    se: string;
    se_type: string;
    language_code: string;
    location_code: number;
    keyword: string;
    device: string;
    tag?: string;
    postback_url?: string;
    postback_data?: string;
    os?: string;
}
