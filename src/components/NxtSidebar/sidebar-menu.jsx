import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { MENUS } from "../../constants/app";
import { USER_ROLE } from '../../constants/app';
import * as _ from 'lodash';

const NxtSidebarMenu = ({ onSidebarItemClick, collapsed }) => {
    const userInfo = useSelector(state => state.user.userInfo);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        if (userInfo) {
            let newMenus = [];
            _.each(MENUS, (menu) => {
                if (!menu.roles || (menu.roles && menu.roles.indexOf(userInfo.role) !== -1)) {
                    if (userInfo.role === USER_ROLE.USER) {
                        if((!menu.type || (menu.type && menu.type === userInfo.type)))
                        newMenus.push(menu);
                    } else {
                        newMenus.push(menu);
                    }
                }
            })
            setMenus(newMenus);
        }
    }, [userInfo])

    return <ul className="ne-sidebar-menu">
        {
            menus.map((menu, idx) => {
                return <li key={idx} className={`ne-menu-item ${menu.isGroup ? 'ne-menu-group' : ''}`}>
                    {
                        menu.isGroup ?
                            <span>{menu.title}</span> :
                            <>
                                {menu.external ? <a className="nav-link" rel="noreferrer" target="_blank" onClick={(e) => onSidebarItemClick(e)} href={menu.route}>
                                    {menu.icon &&
                                        collapsed ? <Tooltip placement="right" title={menu.title}><i className={`ne-menu-item-icon ${menu.icon}`} /></Tooltip> : <i className={`ne-menu-item-icon ${menu.icon}`} />
                                    }
                                    <span className="ne-menu-item-title">{menu.title}</span>
                                </a> :
                                    <>
                                        <NavLink activeClassName="active" to={menu.route} onClick={(e) => onSidebarItemClick(e)}>
                                            {menu.icon &&
                                                collapsed ? <Tooltip placement="right" title={menu.title}><i className={`ne-menu-item-icon ${menu.icon}`} /></Tooltip> : <i className={`ne-menu-item-icon ${menu.icon}`} />
                                            }
                                            <span className="ne-menu-item-title">{menu.title}</span>
                                        </NavLink>
                                        {
                                            menu.menus && <ul className="ne-sub-menu mb-0 pl-0">
                                                {menu.menus.map((sub, idSub) => {
                                                    return <li key={idSub}>
                                                        <NavLink activeClassName="active" to={sub.route} onClick={(e) => onSidebarItemClick(e)}>
                                                            <i className={`ne-menu-item-icon ${menu.icon}`} style={{ visibility: 'hidden' }} />
                                                            <span className="ne-menu-item-title">{sub.title}</span>
                                                        </NavLink>
                                                    </li>
                                                })}
                                            </ul>
                                        }
                                    </>
                                }
                            </>
                    }
                </li>
            })
        }
    </ul>
}
export default NxtSidebarMenu