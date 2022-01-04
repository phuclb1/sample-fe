import { Image } from "react-bootstrap"
import { DEFAULT_IMAGE } from "../../../constants/app";
import NxtTooltip from "../../../components/Tooltip";

const CollactionItem = ({ data, onOpen, onRemove }) => {
    const hanleRemove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove();
    }

    return <NxtTooltip tooltip={data?.description}>
        <div className="fs-result-item" onClick={onOpen}>
            <div className="fs-result-item-image">
                <Image src={data?.image || DEFAULT_IMAGE} alt={data?.name} onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE }} />
            </div>
            <a href="#" className="fs-result-item-remove" onClick={hanleRemove}>
                <i className="fas fa-times"></i>
            </a>
            <div className="fs-result-item-title">{data?.name}</div>
            {data?.faceGroup && <div className={`fs-result-item-score high`} style={{ left: 0, right: 'auto' }}>
                {data?.faceGroup}
            </div>}
        </div>
    </NxtTooltip>
}
export default CollactionItem