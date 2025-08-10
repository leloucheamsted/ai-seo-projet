import './App.css';
import { ConfigProvider } from 'antd';
import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes/index';
function AppRoutes() {
  return useRoutes(routes);
}

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#23555a',
          colorSuccess: '#10B981',
          colorWarning: '#F59E0B',
          colorError: '#EF4444',
          fontFamily: 'Ubuntu, sans-serif',
          colorBgContainer: '#FFFFFF',
          colorBgLayout: '#e1decf',
          colorText: '#000000',
          colorTextSecondary: '#6B7280',
          colorBorder: '#E5E7EB',
          colorBorderSecondary: '#E5E7EB',
        },
      }}
    >
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
