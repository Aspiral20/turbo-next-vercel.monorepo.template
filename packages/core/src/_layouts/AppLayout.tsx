'use client'
import React, { FC, useState } from 'react';
import SidebarLayout from './SidebarLayout';
import DashboardNavbar from './DashboardNavbar';

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  //   return (
  //     <div className="min-h-screen bg-slate-50">
  //       {/* <SidebarLayout
  //         isCollapsed={isSidebarCollapsed}
  //         onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
  //       /> */}
  //       {/* <div
  //         className={`transition-all duration-300 ${
  //           isSidebarCollapsed ? 'ml-20' : 'ml-64'
  //         }`}
  //       > */}
  //         {/* <HeaderLayout/> */}
  //         {/* <BreadcrumbLayout/> */}
  //         {/* <main className="p-6"> */}
  //           {children}
  //         {/* </main> */}
  //       {/* </div> */}
  //       {/* <ToastContainer
  //         position="bottom-right"
  //       /> */}
  //     </div>
  //   );


  return (
    <div className="flex h-screen bg-[#F7F9FC] dark:bg-[#0D1117]">
      <SidebarLayout
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(prev => !prev)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbar />

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;