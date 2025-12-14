import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background" data-testid="dashboard-layout">
      <Sidebar />
      <main className="flex-1 ml-64 p-8" data-testid="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;