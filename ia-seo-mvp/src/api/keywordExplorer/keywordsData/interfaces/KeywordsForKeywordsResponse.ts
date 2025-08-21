// Interface TypeScript pour la réponse de l'API /keywords_for_keywords/live
import { MonthlySearch, KeywordAnnotations, TaskDataBase, KeywordResultBase } from './CommonKeywordInterfaces';

export interface KeywordResult extends KeywordResultBase {
    search_partners: boolean;
    competition: string | null;
    competition_index: number | null;
    low_top_of_page_bid: number | null;
    high_top_of_page_bid: number | null;
    keyword_annotations: KeywordAnnotations;
    year: number | null;
    month: number | null;
    cpc: number | null;
    spell: string | null;

}

export interface TaskData extends TaskDataBase {
    location_code: number;
    keywords: string[];
}

export interface Task {
    id: string;
    user_id?: number;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: TaskData;
    result: KeywordResult[];
}

export interface KeywordsForKeywordsResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: Task[];
}
