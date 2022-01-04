import React from "react";
import './index.css';

const NxtCard = ({ className = '', title, children }) => {
    return <div className={`ne-card ${className}`}>
        {title && <div className="ne-card-header"><span className="ne-card-title">{title}</span></div>}
        <div className="ne-card-body">
            {children}
        </div>
    </div>
}
export default NxtCard