import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';
import { User } from './user.model';

export interface UserDashboardStatsAttributes {
    id: number;
    user_id: number;
    total_api_calls: number;
    total_cost: number;
    today_api_calls: number;
    today_cost: number;
    this_month_api_calls: number;
    this_month_cost: number;
    keywords_tasks_count: number;
    serp_tasks_count: number;
    onpage_tasks_count: number;
    content_analysis_tasks_count: number;
    domain_analysis_tasks_count: number;
    most_used_api: string | null;
    avg_cost_per_task: number;
    last_api_call: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface UserDashboardStatsCreationAttributes extends Optional<UserDashboardStatsAttributes, 'id' | 'created_at' | 'updated_at'> { }

export class UserDashboardStats extends Model<UserDashboardStatsAttributes, UserDashboardStatsCreationAttributes> implements UserDashboardStatsAttributes {
    public id!: number;
    public user_id!: number;
    public total_api_calls!: number;
    public total_cost!: number;
    public today_api_calls!: number;
    public today_cost!: number;
    public this_month_api_calls!: number;
    public this_month_cost!: number;
    public keywords_tasks_count!: number;
    public serp_tasks_count!: number;
    public onpage_tasks_count!: number;
    public content_analysis_tasks_count!: number;
    public domain_analysis_tasks_count!: number;
    public most_used_api!: string | null;
    public avg_cost_per_task!: number;
    public last_api_call!: Date | null;
    public created_at!: Date;
    public updated_at!: Date;
}

UserDashboardStats.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    total_api_calls: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    total_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    today_api_calls: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    today_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    this_month_api_calls: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    this_month_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    keywords_tasks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    serp_tasks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    onpage_tasks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    content_analysis_tasks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    domain_analysis_tasks_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    most_used_api: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    avg_cost_per_task: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
    },
    last_api_call: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    modelName: 'UserDashboardStats',
    tableName: 'user_dashboard_stats',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

// Associations
UserDashboardStats.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
User.hasOne(UserDashboardStats, { foreignKey: 'user_id', as: 'dashboardStats' });
