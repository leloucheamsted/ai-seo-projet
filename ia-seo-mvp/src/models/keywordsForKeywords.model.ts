import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

export interface KeywordsForKeywordsTaskAttributes {
    id: string;
    user_id: number;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: object;
    result: object[];
    params: object;
    isReady: boolean;
    isSearchVolumn?: boolean;
    created_at?: Date;
}

export interface KeywordsForKeywordsTaskCreationAttributes extends Optional<KeywordsForKeywordsTaskAttributes, 'id' | 'created_at' | 'isSearchVolumn'> { }

export class KeywordsForKeywordsTask extends Model<KeywordsForKeywordsTaskAttributes, KeywordsForKeywordsTaskCreationAttributes> implements KeywordsForKeywordsTaskAttributes {
    public id!: string;
    public user_id!: number;
    public status_code!: number;
    public status_message!: string;
    public time!: string;
    public cost!: number;
    public result_count!: number;
    public path!: string[];
    public data!: object;
    public result!: object[];
    public params!: object;
    public isReady!: boolean;
    public isSearchVolumn?: boolean;
    public created_at?: Date;
}

KeywordsForKeywordsTask.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    status_code: DataTypes.INTEGER,
    status_message: DataTypes.STRING,
    time: DataTypes.STRING,
    cost: DataTypes.FLOAT,
    result_count: DataTypes.INTEGER,
    path: DataTypes.JSON,
    data: DataTypes.JSON,
    result: DataTypes.JSON,
    params: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    isReady: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    isSearchVolumn: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'KeywordsForKeywordsTask',
    tableName: 'keywords_for_keywords_tasks',
    timestamps: false,
});
