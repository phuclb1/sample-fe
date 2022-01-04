import React from "react";
import { Dropdown } from "react-bootstrap";

const NxtHeaderMessage = ({onClick}) => {
    return <Dropdown className="ne-header-dropdown ne-header-message">
        <Dropdown.Toggle id="dropdown-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="email"><rect width="24" height="24" opacity="0"></rect><path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.67 2L12 10.75 5.67 6zM19 18H5a1 1 0 0 1-1-1V7.25l7.4 5.55a1 1 0 0 0 .6.2 1 1 0 0 0 .6-.2L20 7.25V17a1 1 0 0 1-1 1z"></path></g></g></svg>
            <span className="ne-total-badge">1</span>
        </Dropdown.Toggle>

        <Dropdown.Menu alignRight={true}>
            <Dropdown.Item onClick={onClick} href="#/action-1">Message #1</Dropdown.Item>
            <Dropdown.Item onClick={onClick} href="#/action-2">Message #2</Dropdown.Item>
            <Dropdown.Item onClick={onClick} href="#/action-3">Message #3</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
}
export default NxtHeaderMessage