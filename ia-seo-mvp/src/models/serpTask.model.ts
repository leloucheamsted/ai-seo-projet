import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

export interface SerpTaskAttributes {
    id: string;
    user_id: number;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: object;
    result: object[] | null;
    isReady?: boolean;
    params?: object;
    created_at?: Date;
}

export interface SerpTaskCreationAttributes extends Optional<SerpTaskAttributes, 'id' | 'isReady' | 'params' | 'created_at'> { }

export class SerpTask extends Model<SerpTaskAttributes, SerpTaskCreationAttributes> implements SerpTaskAttributes {
    public id!: string;
    public user_id!: number;
    public status_code!: number;
    public status_message!: string;
    public time!: string;
    public cost!: number;
    public result_count!: number;
    public path!: string[];
    public data!: object;
    public result!: object[] | null;
    public isReady?: boolean;
    public params?: object;
    public created_at?: Date;
}

SerpTask.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    status_code: DataTypes.INTEGER,
    status_message: DataTypes.STRING,
    time: DataTypes.STRING,
    cost: DataTypes.FLOAT,
    result_count: DataTypes.INTEGER,
    path: DataTypes.JSON,
    data: DataTypes.JSON,
    result: DataTypes.JSON,
    isReady: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    params: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'SerpTask',
    tableName: 'serp_tasks',
    timestamps: false,
});
