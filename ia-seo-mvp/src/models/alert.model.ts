import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

// Interface pour les alertes génériques (peut être étendu pour d'autres types d'alertes)
export interface AlertAttributes {
    id: number;
    user_id: number;
    type: 'rank_change' | 'audit_complete' | 'quota_exceeded' | 'system';
    title: string;
    message: string;
    status: 'pending' | 'sent' | 'failed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    data?: any; // JSONB pour stocker des données supplémentaires
    scheduled_at?: Date;
    sent_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}

export interface AlertCreationAttributes extends Optional<AlertAttributes, 'id' | 'status' | 'priority' | 'data' | 'scheduled_at' | 'sent_at' | 'created_at' | 'updated_at'> { }

export class Alert extends Model<AlertAttributes, AlertCreationAttributes> implements AlertAttributes {
    public id!: number;
    public user_id!: number;
    public type!: 'rank_change' | 'audit_complete' | 'quota_exceeded' | 'system';
    public title!: string;
    public message!: string;
    public status!: 'pending' | 'sent' | 'failed';
    public priority!: 'low' | 'medium' | 'high' | 'urgent';
    public data?: any;
    public scheduled_at?: Date;
    public sent_at?: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    // Methods
    public markAsSent(): void {
        this.status = 'sent';
        this.sent_at = new Date();
    }

    public markAsFailed(): void {
        this.status = 'failed';
    }

    public isReady(): boolean {
        if (this.status !== 'pending') return false;
        if (!this.scheduled_at) return true;
        return new Date() >= this.scheduled_at;
    }

    // Associations
    public getUser!: () => Promise<any>;
}

Alert.init(
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
        type: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                isIn: [['rank_change', 'audit_complete', 'quota_exceeded', 'system']],
            },
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(20),
            defaultValue: 'pending',
            validate: {
                isIn: [['pending', 'sent', 'failed']],
            },
        },
        priority: {
            type: DataTypes.STRING(20),
            defaultValue: 'medium',
            validate: {
                isIn: [['low', 'medium', 'high', 'urgent']],
            },
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'alerts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                fields: ['user_id', 'status'],
            },
            {
                fields: ['type', 'status'],
            },
            {
                fields: ['scheduled_at'],
            },
        ],
    }
);