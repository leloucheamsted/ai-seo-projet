import React from 'react';
import { DashboardCard, StatsCard, TableCard } from '../shared/components/DashboardCard';
import { Row, Col, Table, Button, Progress, Tag } from 'antd';
import {
    SearchOutlined,
    RiseOutlined,
    BarChartOutlined,
    LinkOutlined,
    PlusOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';

const DashboardPage: React.FC = () => {
    // Données exemple pour les tableaux
    const recentKeywords = [
        {
            key: '1',
            keyword: 'SEO optimization',
            volume: 8200,
            difficulty: 65,
            position: 12,
            status: 'tracking'
        },
        {
            key: '2',
            keyword: 'keyword research',
            volume: 5400,
            difficulty: 42,
            position: 8,
            status: 'improved'
        },
        {
            key: '3',
            keyword: 'content marketing',
            volume: 12000,
            difficulty: 78,
            position: 15,
            status: 'declined'
        }
    ];

    const recentAnalyses = [
        {
            key: '1',
            url: 'example.com/blog/seo-guide',
            score: 85,
            date: '2025-08-22',
            status: 'completed'
        },
        {
            key: '2',
            url: 'example.com/services',
            score: 72,
            date: '2025-08-21',
            status: 'completed'
        },
        {
            key: '3',
            url: 'example.com/about',
            score: 91,
            date: '2025-08-20',
            status: 'completed'
        }
    ];

    const keywordColumns = [
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            key: 'keyword',
            render: (text: string) => <span className="font-medium text-darkText">{text}</span>
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            render: (volume: number) => <span className="text-primary font-ubuntu">{volume.toLocaleString()}</span>
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (difficulty: number) => (
                <div className="flex items-center space-x-2">
                    <Progress
                        percent={difficulty}
                        size="small"
                        showInfo={false}
                        strokeColor={difficulty > 70 ? '#EF4444' : difficulty > 40 ? '#FDE047' : '#10B981'}
                    />
                    <span className="text-xs text-darkText/60">{difficulty}%</span>
                </div>
            )
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
            render: (position: number) => <span className="font-medium">{position}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={
                    status === 'improved' ? 'green' :
                        status === 'declined' ? 'red' :
                            'blue'
                }>
                    {status}
                </Tag>
            )
        }
    ];

    const analysisColumns = [
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
            render: (url: string) => <span className="font-medium text-primary">{url}</span>
        },
        {
            title: 'Score',
            dataIndex: 'score',
            key: 'score',
            render: (score: number) => (
                <div className="flex items-center space-x-2">
                    <Progress
                        percent={score}
                        size="small"
                        showInfo={false}
                        strokeColor={score > 80 ? '#10B981' : score > 60 ? '#FDE047' : '#EF4444'}
                    />
                    <span className="font-medium">{score}/100</span>
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => <span className="text-darkText/60">{date}</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color="green">{status}</Tag>
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-darkText font-ubuntu mb-2">Dashboard Overview</h1>
                <p className="text-darkText/60">Monitor your SEO performance and analytics</p>
            </div>

            {/* Stats Cards */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard
                        title="Total Keywords"
                        value="1,247"
                        subtitle="Tracked keywords"
                        trend={{ value: "12%", isPositive: true }}
                        icon={<SearchOutlined className="text-2xl text-primary" />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard
                        title="Avg. Position"
                        value="8.5"
                        subtitle="Average ranking"
                        trend={{ value: "2.3", isPositive: true }}
                        icon={<RiseOutlined className="text-2xl text-primary" />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard
                        title="URLs Analyzed"
                        value="342"
                        subtitle="Total analyses"
                        trend={{ value: "15%", isPositive: true }}
                        icon={<LinkOutlined className="text-2xl text-primary" />}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatsCard
                        title="Active Projects"
                        value="12"
                        subtitle="Ongoing campaigns"
                        trend={{ value: "3", isPositive: true }}
                        icon={<BarChartOutlined className="text-2xl text-primary" />}
                    />
                </Col>
            </Row>

            {/* Main Content Grid */}
            <Row gutter={[24, 24]}>
                {/* Recent Keywords */}
                <Col xs={24} lg={14}>
                    <TableCard
                        title="Recent Keywords Analysis"
                        showExportIcon={true}
                        actions={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                className="bg-primary border-primary hover:bg-primary/80"
                            >
                                Add Keywords
                            </Button>
                        }
                    >
                        <Table
                            columns={keywordColumns}
                            dataSource={recentKeywords}
                            pagination={false}
                            size="middle"
                        />
                        <div className="mt-4 text-center">
                            <Button
                                type="text"
                                icon={<ArrowRightOutlined />}
                                className="text-primary hover:text-primary/80"
                            >
                                View all keywords
                            </Button>
                        </div>
                    </TableCard>
                </Col>

                {/* Recent Analyses */}
                <Col xs={24} lg={10}>
                    <TableCard
                        title="Latest URL Analyses"
                        showExportIcon={true}
                    >
                        <Table
                            columns={analysisColumns}
                            dataSource={recentAnalyses}
                            pagination={false}
                            size="middle"
                        />
                        <div className="mt-4 text-center">
                            <Button
                                type="text"
                                icon={<ArrowRightOutlined />}
                                className="text-primary hover:text-primary/80"
                            >
                                View all analyses
                            </Button>
                        </div>
                    </TableCard>
                </Col>
            </Row>

            {/* Quick Actions */}
            <DashboardCard title="Quick Actions">
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="default"
                            size="large"
                            className="w-full h-20 flex flex-col items-center justify-center border-primary text-primary hover:bg-primary/5"
                            icon={<SearchOutlined className="text-xl mb-1" />}
                        >
                            Analyze Keywords
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="default"
                            size="large"
                            className="w-full h-20 flex flex-col items-center justify-center border-primary text-primary hover:bg-primary/5"
                            icon={<LinkOutlined className="text-xl mb-1" />}
                        >
                            Check URL
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="default"
                            size="large"
                            className="w-full h-20 flex flex-col items-center justify-center border-primary text-primary hover:bg-primary/5"
                            icon={<RiseOutlined className="text-xl mb-1" />}
                        >
                            Monitor Ranks
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="default"
                            size="large"
                            className="w-full h-20 flex flex-col items-center justify-center border-primary text-primary hover:bg-primary/5"
                            icon={<BarChartOutlined className="text-xl mb-1" />}
                        >
                            View Reports
                        </Button>
                    </Col>
                </Row>
            </DashboardCard>
        </div>
    );
};

export default DashboardPage;
