export class ContentAnalysisSummaryLiveParams {
    keyword!: string;
    keyword_fields?: Record<string, string>;
    page_type?: ('ecommerce' | 'news' | 'blogs' | 'message-boards' | 'organization')[];
    internal_list_limit?: number;
    positive_connotation_threshold?: number;
    sentiments_connotation_threshold?: number;
    initial_dataset_filters?: any[];
    rank_scale?: 'one_hundred' | 'one_thousand';
    tag?: string;

    constructor(init?: Partial<ContentAnalysisSummaryLiveParams>) {
        Object.assign(this, init);
    }
}
