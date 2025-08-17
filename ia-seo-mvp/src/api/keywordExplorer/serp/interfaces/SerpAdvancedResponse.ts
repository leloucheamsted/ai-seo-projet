// Interface TypeScript pour la réponse de l'API SERP_LIVE (DataForSEO)
export interface SerpAdvancedItem {
    type: string;
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    domain: string;
    title: string;
    url: string;
    cache_url: string | null;
    related_search_url: string | null;
    breadcrumb: string;
    is_image: boolean;
    is_video: boolean;
    is_featured_snippet: boolean;
    is_malicious: boolean;
    is_web_story: boolean;
    description: string;
    pre_snippet: string | null;
    extended_snippet: string | null;
    images: any;
    amp_version: boolean;
    rating: any;
    price: any;
    highlighted: string[];
    links: any;
    faq: any;
    extended_people_also_search: any;
    about_this_result: any;
    related_result: any;
    timestamp: string | null;
    rectangle: any;
}

export interface SerpAdvancedResult {
    keyword: string;
    type: string;
    se_domain: string;
    location_code: number;
    language_code: string;
    check_url: string;
    datetime: string;
    spell: string | null;
    item_types: string[];
    se_results_count: number;
    items_count: number;
    items: SerpAdvancedItem[];
}

export interface SerpAdvancedTaskData {
    api: string;
    function: string;
    se: string;
    se_type: string;
    language_name: string;
    location_name: string;
    keyword: string;
    device: string;
    os: string;
}

export interface SerpAdvancedTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: SerpAdvancedTaskData;
    result: SerpAdvancedResult[];
}

export interface SerpAdvancedResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: SerpAdvancedTask[];
}
