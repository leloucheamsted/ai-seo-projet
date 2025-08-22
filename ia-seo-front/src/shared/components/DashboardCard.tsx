import React from 'react';
import { Card as AntCard, CardProps } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

interface DashboardCardProps extends CardProps {
    children: React.ReactNode;
    showExportIcon?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
    children,
    showExportIcon = false,
    title,
    className = '',
    ...props
}) => {
    return (
        <AntCard
            title={
                <div className="flex items-center justify-between">
                    {title && (
                        <h3 className="text-lg font-semibold text-darkText m-0 font-ubuntu">
                            {title}
                        </h3>
                    )}
                    {showExportIcon && (
                        <ExportOutlined className="text-darkText/40 hover:text-darkText/60 cursor-pointer" />
                    )}
                </div>
            }
            className={`shadow-sm border-lightGray rounded-lg ${className}`}
            bodyStyle={{ padding: '24px' }}
            headStyle={{
                borderBottom: '1px solid #f0f0f0',
                padding: '16px 24px',
                minHeight: '56px'
            }}
            {...props}
        >
            {children}
        </AntCard>
    );
};

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    trend,
    className = ''
}) => {
    return (
        <div className={`bg-white rounded-lg border border-lightGray p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="text-sm font-medium text-darkText/60 mb-1 font-ubuntu">
                        {title}
                    </div>
                    <div className="text-2xl font-bold text-darkText mb-1 font-ubuntu">
                        {value}
                    </div>
                    {subtitle && (
                        <div className="text-xs text-darkText/40">
                            {subtitle}
                        </div>
                    )}
                    {trend && (
                        <div className={`text-xs mt-2 font-ubuntu ${trend.isPositive ? 'text-primaryDark' : 'text-error'}`}>
                            {trend.isPositive ? '↗' : '↘'} {trend.value}
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="flex-shrink-0 ml-4">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};

interface TableCardProps {
    title: string;
    children: React.ReactNode;
    showExportIcon?: boolean;
    actions?: React.ReactNode;
}

export const TableCard: React.FC<TableCardProps> = ({
    title,
    children,
    showExportIcon = false,
    actions
}) => {
    return (
        <DashboardCard
            title={title}
            showExportIcon={showExportIcon}
            extra={actions}
            className="overflow-hidden"
        >
            <div className="overflow-x-auto">
                {children}
            </div>
        </DashboardCard>
    );
};

export default DashboardCard;
