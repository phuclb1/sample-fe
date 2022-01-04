import { useEffect, useRef, useState } from "react";
import NumberFormat from "react-number-format";
import NxtTooltip from "../../../../components/Tooltip";
import { DEFAULT_IMAGE } from "../../../../constants/app";

const FaceItem = ({ image, name, description, bbox, similarity, ...rest }) => {
    const imageRef = useRef(null);
    const [bboxScaled, setBBoxScaled] = useState(null);
    const getMeta = (url, callback) => {
        const img = new Image();
        img.src = url;
        img.onload = function () { callback(this.width, this.height); }
    }

    useEffect(() => {
        if (image && bbox) {
            getMeta(image, (width) => {
                try {
                    const currentWidth = imageRef.current.width;
                    const scale = currentWidth / width;
                    const bboxScaled = bbox.map((item) => item * scale);
                    setBBoxScaled({
                        left: bboxScaled[0],
                        top: bboxScaled[1],
                        width: bboxScaled[2] - bboxScaled[0],
                        height: bboxScaled[3] - bboxScaled[1]
                    });
                } catch (error) {
                    console.log(error);
                }
            });
        }
        setBBoxScaled(null);
    }, [image, bbox])

    const scoreText = (similarity * 100) < 80 ? 'low' : (similarity * 100) < 85 ? 'high' : 'very high';

    return <div className='fs-result-item' {...rest}>
        <div className="fs-result-item-image position-relative" style={{ maxHeight: '160px' }}>
            {bboxScaled && <div className="fs-result-item-bbox position-absolute" style={{ width: bboxScaled.width, height: bboxScaled.height, top: bboxScaled.top, left: bboxScaled.left }}><div></div></div>}
            <img ref={imageRef} src={image || DEFAULT_IMAGE} alt="" onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE }} />

            {similarity && <NxtTooltip tooltip={`Same person probability ${scoreText}`}>
                <div className={`fs-result-item-score ${scoreText}`} style={{ bottom: 0, top: 'auto' }}>
                    {(similarity * 100) < 80 ? <i className="far fa-thumbs-up mr-1"></i> : <i className="fas fa-thumbs-up mr-1"></i>}
                    <NumberFormat decimalScale="2" displayType="text" displayType="text" value={similarity * 100} thousandSeparator={true} suffix="%" />
                </div>
            </NxtTooltip>}
        </div>
        <div className="fs-result-item-title pt-3 pb-2 px-3 text-left">
            <h6 className="mb-0"><b>{name}</b></h6>
        </div>
        <div className="fs-result-item-description pb-3 px-3">{description}</div>
    </div>
}
export default FaceItem