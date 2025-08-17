// Interface TypeScript pour la réponse de l'API /keywords_for_keywords/ready

export interface ReadyTaskResult {
    id: string;
    se: string;
    function: string;
    date_posted: string;
    tag: string;
    endpoint: string;
}

export interface ReadyTaskData {
    api: string;
    function: string;
    se: string;
}

export interface ReadyTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: ReadyTaskData;
    result: ReadyTaskResult[];
}

export interface KeywordsForKeywordsReadyResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: ReadyTask[];
}
