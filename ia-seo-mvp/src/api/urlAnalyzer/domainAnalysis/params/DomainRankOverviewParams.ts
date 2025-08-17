export class DomainRankOverviewParams {
    /** required field: the domain name of the target website (without https:// and www) */
    target!: string;

    /** optional: full name of the location */
    location_name?: string;

    /** optional: location code */
    location_code?: number;

    /** optional: full name of the language */
    language_name?: string;

    /** optional: language code */
    language_code?: string;

    /** optional: ignore highly similar keywords */
    ignore_synonyms?: boolean;

    /** optional: max number of returned results for domain (default 100, max 1000) */
    limit?: number;

    /** optional: offset in the results array (default 0) */
    offset?: number;

    /** optional: user-defined task identifier (max 255 chars) */
    tag?: string;

    constructor(data: Partial<DomainRankOverviewParams>) {
        Object.assign(this, data);
    }
}

