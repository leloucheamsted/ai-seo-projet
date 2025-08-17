// Classe pour les paramètres de l'API search volume
export class SearchVolumeParams {
    keywords: string[];
    location_name?: string;
    location_code?: string;
    location_coordinate?: string;
    language_name?: string;
    language_code?: string;
    search_partners?: boolean;
    date_from?: string;
    date_to?: string;
    sort_by?: 'relevance' | 'search_volume' | 'competition_index' | 'low_top_of_page_bid' | 'high_top_of_page_bid';
    include_adult_keywords?: boolean;
    tag?: string;

    constructor(data: any) {
        this.keywords = data.keywords;
        this.location_name = data.location_name;
        this.location_code = data.location_code;
        this.location_coordinate = data.location_coordinate;
        this.language_name = data.language_name;
        this.language_code = data.language_code;
        this.search_partners = data.search_partners;
        this.date_from = data.date_from;
        this.date_to = data.date_to;
        this.sort_by = data.sort_by;
        this.include_adult_keywords = data.include_adult_keywords;
        this.tag = data.tag;
    }
}
