import React from 'react';
import { Alert } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface FormHelperProps {
    type: 'success' | 'warning' | 'info' | 'error';
    message: string;
    description?: string;
    showIcon?: boolean;
    className?: string;
}

const FormHelper: React.FC<FormHelperProps> = ({
    type,
    message,
    description,
    showIcon = true,
    className = ''
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleOutlined className="text-green-500" />;
            case 'warning':
                return <ExclamationCircleOutlined className="text-yellow-500" />;
            case 'info':
                return <InfoCircleOutlined className="text-blue-500" />;
            case 'error':
                return <ExclamationCircleOutlined className="text-red-500" />;
            default:
                return null;
        }
    };

    return (
        <Alert
            message={message}
            description={description}
            type={type}
            showIcon={showIcon}
            icon={showIcon ? getIcon() : undefined}
            className={`rounded-lg border-0 ${className}`}
            style={{
                backgroundColor:
                    type === 'success' ? '#f6ffed' :
                        type === 'warning' ? '#fffbe6' :
                            type === 'info' ? '#e6f7ff' :
                                type === 'error' ? '#fff2f0' : '#f5f5f5'
            }}
        />
    );
};

export default FormHelper;
