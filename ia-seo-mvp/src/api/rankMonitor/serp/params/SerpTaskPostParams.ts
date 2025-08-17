// TypeScript class for SERP task_post parameters
export class SerpTaskPostParams {
    keyword!: string;
    url?: string;
    priority?: number;
    depth?: number;
    max_crawl_pages?: number;
    location_name?: string;
    location_code?: number;
    location_coordinate?: string;
    language_name?: string;
    language_code?: string;
    se_domain?: string;
    device?: 'desktop' | 'mobile';
    os?: 'windows' | 'macos' | 'android' | 'ios';
    group_organic_results?: boolean;
    calculate_rectangles?: boolean;
    browser_screen_width?: number;
    browser_screen_height?: number;
    browser_screen_resolution_ratio?: number;
    people_also_ask_click_depth?: number;
    load_async_ai_overview?: boolean;
    expand_ai_overview?: boolean;
    search_param?: string;
    remove_from_url?: string[];
    tag?: string;
    postback_url?: string;
    postback_data?: 'regular' | 'advanced' | 'html';
    pingback_url?: string;
}
