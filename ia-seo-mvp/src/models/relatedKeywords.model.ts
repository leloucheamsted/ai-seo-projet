import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';
import { User } from './user.model';

export interface RelatedKeywordsTaskAttributes {
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
    params?: object;
    created_at?: Date;
}

export interface RelatedKeywordsTaskCreationAttributes extends Optional<RelatedKeywordsTaskAttributes, 'id' | 'params'> { }

export class RelatedKeywordsTask extends Model<RelatedKeywordsTaskAttributes, RelatedKeywordsTaskCreationAttributes> implements RelatedKeywordsTaskAttributes {
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
    public params?: object;
    public created_at?: Date;
}

RelatedKeywordsTask.init({
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
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'RelatedKeywordsTask',
    tableName: 'related_keywords_tasks',
    timestamps: false,
});

RelatedKeywordsTask.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(RelatedKeywordsTask, { foreignKey: 'user_id', as: 'relatedKeywordsTasks' });
