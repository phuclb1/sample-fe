import React from "react";
const NxtSidebarToggle = ({onClick}) => {
    return <button type="button" className="btn ne-button ne-sidebar-toggle" onClick={(e)=>onClick(e)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" className="eva eva-menu-2-outline" fill="currentColor"><g data-name="Layer 2"><g data-name="menu-2"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"></rect><circle cx="4" cy="12" r="1"></circle><rect x="7" y="11" width="14" height="2" rx=".94" ry=".94"></rect><rect x="3" y="16" width="18" height="2" rx=".94" ry=".94"></rect><rect x="3" y="6" width="18" height="2" rx=".94" ry=".94"></rect></g></g></svg>
    </button>
}
export default NxtSidebarToggle