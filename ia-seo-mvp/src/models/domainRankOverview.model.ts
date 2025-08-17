import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db.config';

export interface DomainRankOverviewTaskAttributes {
    id: string;
    status_code: number;
    status_message: string;
    time: string;
    cost: number;
    result_count: number;
    path: string[];
    data: object;
    result: object[];
}

export interface DomainRankOverviewTaskCreationAttributes extends Optional<DomainRankOverviewTaskAttributes, 'id'> { }

export class DomainRankOverviewTask extends Model<DomainRankOverviewTaskAttributes, DomainRankOverviewTaskCreationAttributes> implements DomainRankOverviewTaskAttributes {
    public id!: string;
    public status_code!: number;
    public status_message!: string;
    public time!: string;
    public cost!: number;
    public result_count!: number;
    public path!: string[];
    public data!: object;
    public result!: object[];
}

DomainRankOverviewTask.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    status_code: DataTypes.INTEGER,
    status_message: DataTypes.STRING,
    time: DataTypes.STRING,
    cost: DataTypes.FLOAT,
    result_count: DataTypes.INTEGER,
    path: DataTypes.JSON,
    data: DataTypes.JSON,
    result: DataTypes.JSON,
}, {
    sequelize,
    modelName: 'DomainRankOverviewTask',
    tableName: 'domain_rank_overview_tasks',
    timestamps: false,
});
