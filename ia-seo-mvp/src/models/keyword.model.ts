import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

// Interface pour les recherches de mots-clés
export interface KeywordSearchAttributes {
    id: number;
    user_id: number;
    keyword: string;
    created_at?: Date;
}

export interface KeywordSearchCreationAttributes extends Optional<KeywordSearchAttributes, 'id' | 'created_at'> { }

export class KeywordSearch extends Model<KeywordSearchAttributes, KeywordSearchCreationAttributes> implements KeywordSearchAttributes {
    public id!: number;
    public user_id!: number;
    public keyword!: string;
    public readonly created_at!: Date;

    // Associations
    public getKeywords!: () => Promise<Keyword[]>;
}

// Interface pour les mots-clés et leurs métriques
export interface KeywordAttributes {
    id: number;
    keyword_search_id: number;
    keyword_text: string;
    search_volume?: number;
    cpc?: number;
    keyword_difficulty?: number;
    search_intent?: string;
    opportunity_score?: number;
    serp_snapshot?: any; // JSONB
    created_at?: Date;
}

export interface KeywordCreationAttributes extends Optional<KeywordAttributes, 'id' | 'created_at' | 'search_volume' | 'cpc' | 'keyword_difficulty' | 'search_intent' | 'opportunity_score' | 'serp_snapshot'> { }

export class Keyword extends Model<KeywordAttributes, KeywordCreationAttributes> implements KeywordAttributes {
    public id!: number;
    public keyword_search_id!: number;
    public keyword_text!: string;
    public search_volume?: number;
    public cpc?: number;
    public keyword_difficulty?: number;
    public search_intent?: string;
    public opportunity_score?: number;
    public serp_snapshot?: any;
    public readonly created_at!: Date;

    // Associations
    public getKeywordSearch!: () => Promise<KeywordSearch>;
}

KeywordSearch.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        keyword: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'keyword_searches',
        timestamps: false,
    }
);

Keyword.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        keyword_search_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'keyword_searches',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        keyword_text: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        search_volume: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        cpc: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        keyword_difficulty: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        search_intent: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        opportunity_score: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        serp_snapshot: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'keywords',
        timestamps: false,
    }
);