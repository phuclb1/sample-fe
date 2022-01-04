import React, { useEffect, useState } from 'react';
import NxtHeader from "../components/NxtHeader";
import NxtFooter from "../components/NxtFooter";
import { ToastContainer } from 'react-toastify';
import './AppLayout.css';

function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarState();
    window.addEventListener('resize', setSidebarState)
    return (() => {
      window.removeEventListener('resize', setSidebarState)
    })
  }, [])

  const handleSidebarToggleClick = (e) => {
    const collapsed = !sidebarCollapsed;
    setSidebarCollapsed(collapsed);
  }

  const setSidebarState = () => {
    const winWidth = window.innerWidth;
    if (winWidth <= 992 && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }

  const handleSidebarItemClick = () => {
    hideMobileSidebar();
  }

  const handleHeaderMenuClick = () => {
    hideMobileSidebar();
  }

  const hideMobileSidebar = () => {
    const winWidth = window.innerWidth;
    if (winWidth <= 992) {
      setSidebarCollapsed(true);
    }
  }

  return (
    <>
      <main className={`ne-main-z ${sidebarCollapsed ? 'ne-main-collapsed' : 'ne-main-expanded'} pl-0`}>
        <div className="ne-sidebar-overlay" onClick={() => setSidebarCollapsed(true)}></div>
        <div className="ne-page-content">
          <NxtHeader handleHeaderMenuClick={handleHeaderMenuClick} className={`${sidebarCollapsed ? 'ne-header-collapsed' : 'ne-header-collapsed'}`} onSidebarToggleClick={(e) => handleSidebarToggleClick(e)} />
          <div className="ne-page-content-wrap pt-xl-5 mt-xl-5">
            {children}
          </div>
          <NxtFooter />
        </div>
      </main>
      <ToastContainer />
    </>
  );
}

export default AppLayout;
