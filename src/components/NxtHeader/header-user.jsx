import { Menu, Dropdown } from 'antd';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { DEFAULT_AVATAR, ROUTES } from '../../constants/app';
import { logout } from "../../redux/actions/userAction";
const NxtHeaderUser = ({ onClick }) => {
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.user.userInfo);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        onClick(e);
    }

    const menu = (
        <Menu>
            <Menu.Item key='menu-item-logout'>
                <a className="dropdown-item" onClick={(e) => handleLogout(e)} href="#">
                    Logout
                </a>
            </Menu.Item>
        </Menu>
    );
    return <>
        <div className="ne-header-dropdown ne-header-user">
            <Dropdown overlay={menu} trigger={['click']} overlayClassName="ne-dropdown-header-overlay" placement="bottomRight">
                <a className="dropdown-toggle" onClick={e => e.preventDefault()}>
                    <img src= {DEFAULT_AVATAR} alt="Avatar" />
                    {/* <span className="d-none d-md-block">{userInfo?.username}</span> */}
                </a>
            </Dropdown>
        </div>
    </>
}
export default NxtHeaderUser