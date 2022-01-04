import { OverlayTrigger, Tooltip } from "react-bootstrap";

const NxtTooltip = ({ children, placement = 'top', tooltip }) => {
    const renderTooltip = (props) => (
        tooltip ? <Tooltip {...props}>
            {tooltip}
        </Tooltip> : <></>
    );

    return (
        <OverlayTrigger
            placement={placement}
            overlay={renderTooltip}
        >
            {children}
        </OverlayTrigger>
    )
}
export default NxtTooltip;