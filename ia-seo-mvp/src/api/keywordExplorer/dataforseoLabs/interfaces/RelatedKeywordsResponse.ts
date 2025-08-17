// Interface TypeScript pour la réponse de l'API related_keywords (DataForSEO Labs)
export interface RelatedKeywordsMonthlySearch {
    year: number;
    month: number;
    search_volume: number;
}

export interface RelatedKeywordsKeywordInfo {
    se_type: string;
    last_updated_time: string;
    competition: number;
    cpc: number;
    search_volume: number;
    categories: number[];
    monthly_searches: RelatedKeywordsMonthlySearch[];
}

export interface RelatedKeywordsKeywordProperties {
    se_type: string;
    core_keyword: string | null;
    keyword_difficulty: number;
}

export interface RelatedKeywordsImpressionsInfo {
    se_type: string;
    last_updated_time: string;
    bid: number;
    match_type: string;
    ad_position_min: number;
    ad_position_max: number;
    ad_position_average: number;
    cpc_min: number;
    cpc_max: number;
    cpc_average: number;
    daily_impressions_min: number;
    daily_impressions_max: number;
    daily_impressions_average: number;
    daily_clicks_min: number;
    daily_clicks_max: number;
    daily_clicks_average: number;
    daily_cost_min: number;
    daily_cost_max: number;
    daily_cost_average: number;
}

export interface RelatedKeywordsSerpInfo {
    se_type: string;
    check_url: string;
    serp_item_types: string[];
    se_results_count: number;
    last_updated_time: string;
    previous_updated_time: string | null;
}

export interface RelatedKeywordsKeywordData {
    se_type: string;
    keyword: string;
    location_code: number;
    language_code: string;
    keyword_info: RelatedKeywordsKeywordInfo;
    keyword_properties: RelatedKeywordsKeywordProperties;
    impressions_info: RelatedKeywordsImpressionsInfo;
    serp_info: RelatedKeywordsSerpInfo;
}

export interface RelatedKeywordsItem {
    se_type: string;
    keyword_data: RelatedKeywordsKeywordData;
    depth: number;
    related_keywords: string[];
}

export interface RelatedKeywordsResult {
    se_type: string;
    seed_keyword: string;
    seed_keyword_data: any;
    location_code: number;
    language_code: string;
    total_count: number;
    items_count: number;
    items: RelatedKeywordsItem[];
}

export interface RelatedKeywordsTaskData {
    api: string;
    function: string;
    se_type: string;
    keyword: string;
    language_name: string;
    location_code: number;
    limit: number;
}

export interface RelatedKeywordsTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: RelatedKeywordsTaskData;
    result: RelatedKeywordsResult[];
}

export interface RelatedKeywordsResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: RelatedKeywordsTask[];
}
