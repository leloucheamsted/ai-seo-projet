import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

// Interface pour les demandes d'audit URL
export interface UrlAuditAttributes {
    id: number;
    user_id: number;
    url: string;
    status: 'pending' | 'completed' | 'failed';
    requested_at?: Date;
    completed_at?: Date;
}

export interface UrlAuditCreationAttributes extends Optional<UrlAuditAttributes, 'id' | 'status' | 'requested_at' | 'completed_at'> { }

export class UrlAudit extends Model<UrlAuditAttributes, UrlAuditCreationAttributes> implements UrlAuditAttributes {
    public id!: number;
    public user_id!: number;
    public url!: string;
    public status!: 'pending' | 'completed' | 'failed';
    public readonly requested_at!: Date;
    public completed_at?: Date;

    // Associations
    public getUrlAuditTechnical!: () => Promise<UrlAuditTechnical>;
    public getUrlAuditContent!: () => Promise<UrlAuditContent>;
}

// Interface pour les résultats de l'audit technique
export interface UrlAuditTechnicalAttributes {
    id: number;
    url_audit_id: number;
    core_web_vitals?: any; // JSONB
    technical_errors?: any; // JSONB
    score?: number;
    created_at?: Date;
}

export interface UrlAuditTechnicalCreationAttributes extends Optional<UrlAuditTechnicalAttributes, 'id' | 'core_web_vitals' | 'technical_errors' | 'score' | 'created_at'> { }

export class UrlAuditTechnical extends Model<UrlAuditTechnicalAttributes, UrlAuditTechnicalCreationAttributes> implements UrlAuditTechnicalAttributes {
    public id!: number;
    public url_audit_id!: number;
    public core_web_vitals?: any;
    public technical_errors?: any;
    public score?: number;
    public readonly created_at!: Date;

    // Associations
    public getUrlAudit!: () => Promise<UrlAudit>;
}

// Interface pour les résultats de l'analyse de contenu
export interface UrlAuditContentAttributes {
    id: number;
    url_audit_id: number;
    semantic_score?: number;
    missing_entities?: any; // JSONB
    created_at?: Date;
}

export interface UrlAuditContentCreationAttributes extends Optional<UrlAuditContentAttributes, 'id' | 'semantic_score' | 'missing_entities' | 'created_at'> { }

export class UrlAuditContent extends Model<UrlAuditContentAttributes, UrlAuditContentCreationAttributes> implements UrlAuditContentAttributes {
    public id!: number;
    public url_audit_id!: number;
    public semantic_score?: number;
    public missing_entities?: any;
    public readonly created_at!: Date;

    // Associations
    public getUrlAudit!: () => Promise<UrlAudit>;
}

UrlAudit.init(
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
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: 'pending',
            validate: {
                isIn: [['pending', 'completed', 'failed']],
            },
        },
        requested_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'url_audits',
        timestamps: false,
    }
);

UrlAuditTechnical.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        url_audit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'url_audits',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        core_web_vitals: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        technical_errors: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        score: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'url_audit_technical',
        timestamps: false,
    }
);

UrlAuditContent.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        url_audit_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'url_audits',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        semantic_score: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
        },
        missing_entities: {
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
        tableName: 'url_audit_content',
        timestamps: false,
    }
);