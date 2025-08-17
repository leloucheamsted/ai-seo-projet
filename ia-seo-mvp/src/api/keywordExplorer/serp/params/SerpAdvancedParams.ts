// Classe pour les paramètres de l'API SERP_LIVE (DataForSEO)
export class SerpAdvancedParams {
    keywords: string[];
    url?: string;
    depth?: number;
    max_crawl_pages?: number;
    location_name?: string;
    location_code?: string;
    se_domain?: string;
    device?: 'desktop' | 'mobile';
    os?: string;
    location_coordinate?: string;
    language_name?: string;
    language_code?: string;
    target?: string;
    group_organic_results?: boolean;
    calculate_rectangles?: boolean;
    browser_screen_width?: number;
    browser_screen_height?: number;
    browser_screen_resolution_ratio?: number;
    people_also_ask_click_depth?: number;
    load_async_ai_overview?: boolean;
    search_param?: string;
    remove_from_url?: string;
    tag?: string;

    constructor(data: any) {
        this.keywords = data.keywords;
        this.url = data.url;
        this.depth = data.depth;
        this.max_crawl_pages = data.max_crawl_pages;
        this.location_name = data.location_name;
        this.location_code = data.location_code;
        this.se_domain = data.se_domain;
        this.device = data.device;
        this.os = data.os;
        this.location_coordinate = data.location_coordinate;
        this.language_name = data.language_name;
        this.language_code = data.language_code;
        this.target = data.target;
        this.group_organic_results = data.group_organic_results;
        this.calculate_rectangles = data.calculate_rectangles;
        this.browser_screen_width = data.browser_screen_width;
        this.browser_screen_height = data.browser_screen_height;
        this.browser_screen_resolution_ratio = data.browser_screen_resolution_ratio;
        this.people_also_ask_click_depth = data.people_also_ask_click_depth;
        this.load_async_ai_overview = data.load_async_ai_overview;
        this.search_param = data.search_param;
        this.remove_from_url = data.remove_from_url;
        this.tag = data.tag;
    }
}
