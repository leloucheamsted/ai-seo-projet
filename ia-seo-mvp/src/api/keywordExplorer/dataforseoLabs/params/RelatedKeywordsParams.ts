// Classe pour les paramètres de l'API related_keywords (DataForSEO Labs)
export class RelatedKeywordsParams {
    keyword: string;
    location_name?: string;
    location_code?: string;
    language_name?: string;
    language_code?: string;
    depth?: number;
    include_seed_keyword?: boolean;
    include_serp_info?: boolean;
    include_clickstream_data?: boolean;
    ignore_synonyms?: boolean;
    replace_with_core_keyword?: boolean;
    filters?: any[];
    order_by?: any[];
    limit?: number;
    offset?: number;
    tag?: string;

    constructor(data: any) {
        this.keyword = data.keyword;
        this.location_name = data.location_name;
        this.location_code = data.location_code;
        this.language_name = data.language_name;
        this.language_code = data.language_code;
        this.depth = data.depth;
        this.include_seed_keyword = data.include_seed_keyword;
        this.include_serp_info = data.include_serp_info;
        this.include_clickstream_data = data.include_clickstream_data;
        this.ignore_synonyms = data.ignore_synonyms;
        this.replace_with_core_keyword = data.replace_with_core_keyword;
        this.filters = data.filters;
        this.order_by = data.order_by;
        this.limit = data.limit;
        this.offset = data.offset;
        this.tag = data.tag;
    }
}
