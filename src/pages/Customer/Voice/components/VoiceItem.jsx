import { Button, Tooltip } from "antd"
import { Link } from "react-router-dom"
import { ROUTES } from "../../../../constants/app"

const VoiceItem = ({ data, onDelete, ...rest }) => {
    return <div className='fs-result-item' {...rest}>
        <div className="p-3 text-center">
            {data && <>
                <div className="fs-result-item-image position-relative" style={{ height: 'auto' }}>
                    {
                        data?.audios?.map((a, i) => {
                            return <audio key={i} className="w-100" controls="controls" autobuffer="autobuffer">
                                <source src={a} />
                            </audio>
                        })
                    }
                </div>
                <div className="audio-info mt-3">
                    <h6 className="mb-0 audio-title"><b>{data?.name}</b></h6>
                    <div className="text-nowrap">
                        <Tooltip placement="right" title="Edit">
                            <Link size="small" className="ant-btn ant-btn-primary ant-btn-circle ant-btn-sm mr-2" to={`${ROUTES.VOICES}/edit/${data.id}`}>
                                <i className="far fa-edit"></i>
                            </Link>
                        </Tooltip>
                        <Tooltip placement="right" title="Delete">
                            <Button size="small" shape="circle" type="danger" className="ant-btn ant-btn-danger ant-btn-circle ant-btn-sm" onClick={(e) => onDelete(e, data.id)}>
                                <i className="far fa-trash-alt"></i>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </>}
        </div>
    </div>
}
export default VoiceItem