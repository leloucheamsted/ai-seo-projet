export class DomainCompetitorsParams {
    target!: string;
    location_name?: string;
    location_code?: number;
    language_name?: string;
    language_code?: string;
    item_types?: Array<'organic' | 'paid' | 'featured_snippet' | 'local_pack'>;
    include_clickstream_data?: boolean;
    filters?: any[];
    order_by?: string[];
    limit?: number;
    offset?: number;
    max_rank_group?: number;
    exclude_top_domains?: boolean;
    intersecting_domains?: string[];
    ignore_synonyms?: boolean;
    tag?: string;

    constructor(init?: Partial<DomainCompetitorsParams>) {
        Object.assign(this, init);
    }
}
