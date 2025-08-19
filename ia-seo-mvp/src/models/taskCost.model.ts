import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';
import { User } from './user.model';

export interface TaskCostAttributes {
    id: number;
    user_id: number;
    task_id: string;
    task_type: string; // 'keywords_for_keywords', 'serp', 'onpage', etc.
    cost: number;
    api_endpoint: string;
    status_code: number;
    created_at: Date;
}

export interface TaskCostCreationAttributes extends Optional<TaskCostAttributes, 'id' | 'created_at'> { }

export class TaskCost extends Model<TaskCostAttributes, TaskCostCreationAttributes> implements TaskCostAttributes {
    public id!: number;
    public user_id!: number;
    public task_id!: string;
    public task_type!: string;
    public cost!: number;
    public api_endpoint!: string;
    public status_code!: number;
    public created_at!: Date;
}

TaskCost.init({
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
    },
    task_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    task_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    api_endpoint: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'TaskCost',
    tableName: 'task_costs',
    timestamps: false,
});

// Associations
TaskCost.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasMany(TaskCost, { foreignKey: 'user_id', as: 'taskCosts' });
