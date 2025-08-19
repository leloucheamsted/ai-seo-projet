// Interface TypeScript pour la réponse de l'API SERP Task Ready

export interface SerpTaskReadyResult {
    id: string;
    se: string;
    se_type: string;
    date_posted: string;
    tag: string;
    endpoint_regular: string | null;
    endpoint_advanced: string | null;
    endpoint_html: string | null;
}

export interface SerpTaskReadyData {
    api: string;
    function: string;
    se: string;
}

export interface SerpTaskReadyTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: SerpTaskReadyData;
    result: SerpTaskReadyResult[];
}

export interface SerpTaskReadyResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: SerpTaskReadyTask[];
}
