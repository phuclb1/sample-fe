import React from "react";
import './index.css';

const NextPageHeader = ({ className = '', title, icon, children, sub_title = '', header_action_icon = "fas fa-bullseye", header_action_class = "btn-success ml-3", header_action = '', breadcrumb, onHeaderClick }) => {
  return <div className={`ne-page-header ${className}`}>
    <div className="d-flex align-items-center justify-content-between">
      <h1 className="d-flex align-items-center">
        {icon && <i className={`ne-button-icon mr-3 ${icon}`} />}
        {title && <span>{title}</span>}
        {sub_title && <div className="d-flex" dangerouslySetInnerHTML={{ __html: sub_title }}></div>}
        {header_action && <div className="d-flex">
          <button className={`btn ${header_action_class} btn-sm`} type="button" onClick={onHeaderClick}><i className={`mr-1 ${header_action_icon}`}></i>{header_action}</button>
        </div>}
      </h1>
      {breadcrumb && <span className="ne-breadcrumb">Home&nbsp;&nbsp;/&nbsp;&nbsp;<span>{breadcrumb}</span></span>}
    </div>
    {children}
  </div>
}
export default NextPageHeader