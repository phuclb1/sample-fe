import React from "react";
import './index.css';
import NxtSidebarMenu from "./sidebar-menu";
import NxtSidebarToggle from "../NxtHeader/header-sidebar-toggle";
import NxtHeaderLogo from "../NxtHeader/header-logo";

const NxtSidebar = ({ collapsed, onSidebarItemClick, onSidebarToggleClick }) => {

    return <div id="sidebar" className={`ne-sidebar ${collapsed ? 'ne-sidebar-collapsed' : 'ne-sidebar-expanded'}`}>
        <div className="ne-sidebar-wrap">
            <div className="d-flex align-items-center justify-content-between px-3 mb-4">
                <NxtHeaderLogo />
                <NxtSidebarToggle onClick={(e) => onSidebarToggleClick(e)} />
            </div>
            <NxtSidebarMenu collapsed={collapsed} onSidebarItemClick={onSidebarItemClick} />
        </div>
    </div>
}
export default NxtSidebar