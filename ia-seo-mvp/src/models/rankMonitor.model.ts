import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

// Interface pour la visibilité globale du domaine
export interface DomainVisibilityAttributes {
    id: number;
    domain: string;
    traffic_estimate?: bigint;
    visibility_score?: number;
    last_updated?: Date;
}

export interface DomainVisibilityCreationAttributes extends Optional<DomainVisibilityAttributes, 'id' | 'traffic_estimate' | 'visibility_score' | 'last_updated'> { }

export class DomainVisibility extends Model<DomainVisibilityAttributes, DomainVisibilityCreationAttributes> implements DomainVisibilityAttributes {
    public id!: number;
    public domain!: string;
    public traffic_estimate?: bigint;
    public visibility_score?: number;
    public readonly last_updated!: Date;
}

// Interface pour le suivi des positions des mots-clés
export interface RankMonitorAttributes {
    id: number;
    user_id: number;
    domain: string;
    keyword: string;
    competitor_domain?: string;
    current_position?: number;
    serp_features?: any; // JSONB
    tracked_date: Date;
    created_at?: Date;
}

export interface RankMonitorCreationAttributes extends Optional<RankMonitorAttributes, 'id' | 'competitor_domain' | 'current_position' | 'serp_features' | 'created_at'> { }

export class RankMonitor extends Model<RankMonitorAttributes, RankMonitorCreationAttributes> implements RankMonitorAttributes {
    public id!: number;
    public user_id!: number;
    public domain!: string;
    public keyword!: string;
    public competitor_domain?: string;
    public current_position?: number;
    public serp_features?: any;
    public tracked_date!: Date;
    public readonly created_at!: Date;

    // Associations
    public getRankAlerts!: () => Promise<RankAlert[]>;
}

// Interface pour les alertes email sur variations
export interface RankAlertAttributes {
    id: number;
    user_id: number;
    rank_monitor_id: number;
    alert_type?: 'gain' | 'perte' | 'autre';
    message?: string;
    alert_date?: Date;
    is_sent?: boolean;
}

export interface RankAlertCreationAttributes extends Optional<RankAlertAttributes, 'id' | 'alert_type' | 'message' | 'alert_date' | 'is_sent'> { }

export class RankAlert extends Model<RankAlertAttributes, RankAlertCreationAttributes> implements RankAlertAttributes {
    public id!: number;
    public user_id!: number;
    public rank_monitor_id!: number;
    public alert_type?: 'gain' | 'perte' | 'autre';
    public message?: string;
    public readonly alert_date!: Date;
    public is_sent?: boolean;

    // Associations
    public getRankMonitor!: () => Promise<RankMonitor>;
}

DomainVisibility.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        domain: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        traffic_estimate: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        visibility_score: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        last_updated: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'domain_visibility',
        timestamps: false,
    }
);

RankMonitor.init(
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
        domain: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        keyword: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        competitor_domain: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        current_position: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        serp_features: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        tracked_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'rank_monitor',
        timestamps: false,
    }
);

RankAlert.init(
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
        rank_monitor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'rank_monitor',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        alert_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
            validate: {
                isIn: [['gain', 'perte', 'autre']],
            },
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        alert_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        is_sent: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'rank_alerts',
        timestamps: false,
    }
);