// TypeScript interface for the response of SERP task_get endpoint

export interface SerpTaskGetResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: SerpTaskGetTask[];
}

export interface SerpTaskGetTask {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: SerpTaskGetTaskData;
    result: SerpTaskGetResult[];
}

export interface SerpTaskGetTaskData {
    api: string;
    function: string;
    se: string;
    se_type: string;
    language_code: string;
    location_code: number;
    keyword: string;
    device: string;
    tag?: string;
    postback_url?: string;
    postback_data?: string;
    os?: string;
}

export interface SerpTaskGetResult {
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
    items: SerpTaskGetItem[];
}

export type SerpTaskGetItem = SerpOrganicItem | SerpPeopleAlsoAskItem | SerpTwitterItem | SerpVideoItem | SerpRelatedSearchesItem | SerpMultiCarouselItem | SerpKnowledgeGraphItem;

export interface SerpOrganicItem {
    type: 'organic';
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
    images: null | string[];
    amp_version: boolean;
    rating: number | null;
    price: number | null;
    highlighted: string[];
    links: SerpLinkElement[] | null;
    faq: null;
    extended_people_also_search: null;
    about_this_result: SerpAboutThisResultElement | null;
    related_result: null;
    timestamp: string | null;
    rectangle: null;
}

export interface SerpPeopleAlsoAskItem {
    type: 'people_also_ask';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    items: SerpPeopleAlsoAskElement[];
    rectangle: null;
}

export interface SerpPeopleAlsoAskElement {
    type: 'people_also_ask_element';
    title: string;
    xpath: string;
    expanded_element: SerpPeopleAlsoAskExpandedElement[];
}

export interface SerpPeopleAlsoAskExpandedElement {
    type: 'people_also_ask_expanded_element';
    featured_title: string | null;
    url: string;
    domain: string;
    title: string;
    description: string;
    timestamp: string | null;
    table: null;
}

export interface SerpLinkElement {
    type: 'link_element';
    title: string;
    description: string | null;
    url: string;
}

export interface SerpAboutThisResultElement {
    type: 'about_this_result_element';
    url: string;
    source: string | null;
    source_info: string | null;
    source_url: string | null;
    language: string;
    location: string;
    search_terms: string[];
    related_terms: string[] | null;
}

export interface SerpTwitterItem {
    type: 'twitter';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    title: string;
    url: string;
    items: SerpTwitterElement[];
    rectangle: null;
}

export interface SerpTwitterElement {
    type: 'twitter_element';
    tweet: string;
    date: string;
    timestamp: string;
    url: string;
}

export interface SerpVideoItem {
    type: 'video';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    items: SerpVideoElement[];
    rectangle: null;
}

export interface SerpVideoElement {
    type: 'video_element';
    source: string;
    title: string;
    timestamp: string;
    url: string;
}

export interface SerpRelatedSearchesItem {
    type: 'related_searches';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    items: string[];
    rectangle: null;
}

export interface SerpMultiCarouselItem {
    type: 'multi_carousel';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    items: SerpMultiCarouselElement[];
    rectangle: null;
}

export interface SerpMultiCarouselElement {
    type: 'multi_carousel_element';
    title: string;
    multi_carousel_snippets: SerpMultiCarouselSnippet[];
}

export interface SerpMultiCarouselSnippet {
    type: 'multi_carousel_snippet';
    title: string;
}

export interface SerpKnowledgeGraphItem {
    type: 'knowledge_graph';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    title: string;
    sub_title: string;
    description: string;
    card_id: string | null;
    url: string | null;
    image_url: string | null;
    logo_url: string | null;
    cid: string | null;
    items: (SerpKnowledgeGraphImagesItem | SerpKnowledgeGraphDescriptionItem | SerpKnowledgeGraphRowItem | SerpKnowledgeGraphCarouselItem)[];
    rectangle: null;
}

export interface SerpKnowledgeGraphImagesItem {
    type: 'knowledge_graph_images_item';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    link: SerpLinkElement;
    items: SerpKnowledgeGraphImagesElement[];
    rectangle: null;
}

export interface SerpKnowledgeGraphImagesElement {
    type: 'knowledge_graph_images_element';
    url: string | null;
    domain: string | null;
    alt: string;
    image_url: string;
    xpath: string;
}

export interface SerpKnowledgeGraphDescriptionItem {
    type: 'knowledge_graph_description_item';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    text: string;
    links: SerpLinkElement[];
    rectangle: null;
}

export interface SerpKnowledgeGraphRowItem {
    type: 'knowledge_graph_row_item';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    title: string;
    data_attrid: string;
    text: string;
    links: SerpLinkElement[];
    rectangle: null;
}

export interface SerpKnowledgeGraphCarouselItem {
    type: 'knowledge_graph_carousel_item';
    rank_group: number;
    rank_absolute: number;
    position: string;
    xpath: string;
    title: string;
    data_attrid: string | null;
    link: SerpLinkElement;
    items: SerpKnowledgeGraphCarouselElement[];
    rectangle: null;
}

export interface SerpKnowledgeGraphCarouselElement {
    type: 'knowledge_graph_carousel_element';
    title: string;
    subtitle: string | null;
    url: string;
    domain: string;
    image_url: string;
    xpath: string;
}
