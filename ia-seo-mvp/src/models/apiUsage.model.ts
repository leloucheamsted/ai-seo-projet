import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

// Interface pour la gestion des quotas et rate limits
export interface ApiUsageAttributes {
    id: number;
    user_id?: number;
    api_name: string;
    usage_count: number;
    quota_limit?: number;
    reset_date?: Date;
    created_at?: Date;
}

export interface ApiUsageCreationAttributes extends Optional<ApiUsageAttributes, 'id' | 'user_id' | 'usage_count' | 'quota_limit' | 'reset_date' | 'created_at'> { }

export class ApiUsage extends Model<ApiUsageAttributes, ApiUsageCreationAttributes> implements ApiUsageAttributes {
    public id!: number;
    public user_id?: number;
    public api_name!: string;
    public usage_count!: number;
    public quota_limit?: number;
    public reset_date?: Date;
    public readonly created_at!: Date;

    // Methods
    public incrementUsage(): void {
        this.usage_count += 1;
    }

    public isQuotaExceeded(): boolean {
        if (!this.quota_limit) return false;
        return this.usage_count >= this.quota_limit;
    }

    public shouldReset(): boolean {
        if (!this.reset_date) return false;
        return new Date() >= this.reset_date;
    }

    public resetUsage(): void {
        this.usage_count = 0;
        // Reset date to next period (e.g., next month)
        if (this.reset_date) {
            const nextReset = new Date(this.reset_date);
            nextReset.setMonth(nextReset.getMonth() + 1);
            this.reset_date = nextReset;
        }
    }

    // Associations
    public getUser!: () => Promise<any>;
}

ApiUsage.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        api_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        usage_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        quota_limit: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        reset_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'api_usage',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'api_name'],
            },
        ],
    }
);