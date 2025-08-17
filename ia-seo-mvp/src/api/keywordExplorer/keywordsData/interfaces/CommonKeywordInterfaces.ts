// Interfaces réutilisables pour les réponses Keyword Explorer

export interface MonthlySearch {
    year: number;
    month: number;
    search_volume: number;
}

export interface KeywordAnnotations {
    concepts: any;
}

export interface KeywordResultBase {
    keyword: string;
    location_code: number;
    language_code?: string | null;
    search_volume: number;
    monthly_searches: MonthlySearch[];
}

export interface TaskDataBase {
    api: string;
    function: string;
    se: string;
}
