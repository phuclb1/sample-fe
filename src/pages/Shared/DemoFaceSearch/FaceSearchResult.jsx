import { useState } from "react"
import { Row, Col, Nav } from "react-bootstrap";
import ReactJson from "react-json-view";
import Flex from "../../../components/Flex";
import NxtTooltip from "../../../components/Tooltip";
import FaceImageDetailModal from "../../../components/FaceImageDetailModal";
import 'react-multi-carousel/lib/styles.css';
import { Card } from 'antd';
import FaceItem from "../../Customer/Face/components/FaceItem";
import API from "../../../services/API";

const FaceSearchResult = ({ results, onReset }) => {
    const [selectedTab, setSelectedTab] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleCloseDetail = () => {
        setSelectedItem(null);
        setShowModal(false);
    }

    return <>
        <Card>
            <Flex justifyContent="between">
                <Nav className="nav-tabs nav-tunnel nav-slider mb-0">
                    <Nav.Item>
                        <Nav.Link className={`d-flex align-items-center ${selectedTab === 1 ? 'active' : ''}`} type="button" onClick={() => setSelectedTab(1)}>
                            Search results
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className={`d-flex align-items-center ${selectedTab === 2 ? 'active' : ''}`} type="button" onClick={() => setSelectedTab(2)}>
                            JSON result
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <NxtTooltip tooltip="Clear search">
                    <button type="button" className="btn btn-soft-primary btn-settings" onClick={onReset}>
                        <i className="fas fa-sync-alt text-muted"></i>
                    </button>
                </NxtTooltip>
            </Flex>
            <div className="tab-content pt-3">
                {results ? <>
                    {selectedTab === 1 ?
                        <div className="tab-pane bd-heading-1 fade show active" id="content-results" role="tabpanel" aria-labelledby="tab-results">
                            {results.length > 0 ? <div style={{ minHeight: '190px' }}>
                                <Row>
                                    {
                                        results.map((item, idx) => {
                                            return <Col md="4" key={idx}>
                                                <FaceItem image={API.customer.getResource(item.root_image)} name={item.name} description={item.description} bbox={item.bbox} similarity={item.similarity} />
                                            </Col>
                                        })
                                    }
                                </Row>
                            </div> : <div style={{ minHeight: '190px' }}>No data found.</div>
                            }
                        </div> :
                        <div className="tab-pane bd-heading-1 fade show active" id="content-json" role="tabpanel" aria-labelledby="tab-json">
                            <div className="fa-demo-tab-pane-body bg-dark text-white">
                                {results && <ReactJson
                                    theme="bright"
                                    src={results}
                                    iconStyle="square"
                                    enableClipboard={false}
                                    displayObjectSize={false}
                                    displayDataTypes={false} />
                                }
                            </div>
                        </div>
                    }
                </> : <>
                    <div className="tab-pane bd-heading-1 fade show active">
                        <div className="fa-demo-tab-pane-body align-items-center justify-content-center d-flex">
                            <small className="text-muted">
                                To search, either submit an image or use your camera to capture a face.
                            </small>
                        </div>
                    </div>
                </>}

            </div>
        </Card>

        <FaceImageDetailModal show={showModal} onDismiss={handleCloseDetail} data={selectedItem} />
    </>
}
export default FaceSearchResult;