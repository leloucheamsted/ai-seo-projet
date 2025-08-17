// Interface TypeScript pour la réponse de l'API /keywords_for_site/live
import { MonthlySearch, KeywordAnnotations, TaskDataBase, KeywordResultBase } from './CommonKeywordInterfaces';

export interface KeywordForSiteResult extends KeywordResultBase {
    search_partners: boolean;
    competition: string | null;
    competition_index: number | null;
    low_top_of_page_bid: number | null;
    high_top_of_page_bid: number | null;
    keyword_annotations: KeywordAnnotations;
}

export interface KeywordsForSiteTaskData extends TaskDataBase {
    location_code: number;
    language_code?: string;
    target: string;
}

export interface KeywordsForSiteTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: KeywordsForSiteTaskData;
    result: KeywordForSiteResult[];
}

export interface KeywordsForSiteLiveResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: KeywordsForSiteTask[];
}
