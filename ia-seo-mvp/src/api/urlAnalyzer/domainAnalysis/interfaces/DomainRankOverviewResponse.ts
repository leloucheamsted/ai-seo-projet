export interface DomainRankOverviewResponse {
    version: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    tasks_count: number;
    tasks_error: number;
    tasks: Array<{
        id: string;
        status_code: number;
        status_message: string;
        time: string;
        cost: number;
        result_count: number;
        path: string[];
        data: {
            [key: string]: any;
        };
        result: Array<{
            se_type: string;
            target: string;
            location_code: number;
            language_code: string;
            total_count: number;
            items_count: number;
            items: Array<{
                se_type: string;
                location_code: number;
                language_code: string;
                metrics: {
                    organic: {
                        pos_1: number;
                        pos_2_3: number;
                        pos_4_10: number;
                        pos_11_20: number;
                        pos_21_30: number;
                        pos_31_40: number;
                        pos_41_50: number;
                        pos_51_60: number;
                        pos_61_70: number;
                        pos_71_80: number;
                        pos_81_90: number;
                        pos_91_100: number;
                        etv: number;
                        count: number;
                        estimated_paid_traffic_cost: number;
                        is_new: number;
                        is_up: number;
                        is_down: number;
                        is_lost: number;
                    };
                    paid: {
                        pos_1: number;
                        pos_2_3: number;
                        pos_4_10: number;
                        pos_11_20: number;
                        pos_21_30: number;
                        pos_31_40: number;
                        pos_41_50: number;
                        pos_51_60: number;
                        pos_61_70: number;
                        pos_71_80: number;
                        pos_81_90: number;
                        pos_91_100: number;
                        etv: number;
                        count: number;
                        estimated_paid_traffic_cost: number;
                        is_new: number;
                        is_up: number;
                        is_down: number;
                        is_lost: number;
                    };
                };
            }>;
        }>;
    }>;
}
