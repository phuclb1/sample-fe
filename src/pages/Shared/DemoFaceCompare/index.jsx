import { useEffect, useRef, useState } from "react";
import BlockUi from "react-block-ui";
import { Row, Col, Nav, Button, Form } from "react-bootstrap";
import ReactJson from "react-json-view";
import { toast } from "react-toastify";
import Flex from "../../../components/Flex";
import NxtTooltip from "../../../components/Tooltip";
import UploadComponent from "../../../components/UploadComponent";
import API from "../../../services/API";
import CountUp from 'react-countup';
import NextPageHeader from "../../../components/NxtPageHeader";
import { Card, Image } from 'antd';
import { DEFAULT_IMAGE } from "../../../constants/app";
import Webcam from "react-webcam";

const DemoFaceComparePage = () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const [selectedTab, setSelectedTab] = useState(1);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [url1, setUrl1] = useState(null);
    const [url2, setUrl2] = useState(null);
    const [useCamera1, setUseCamera1] = useState(false);
    const [useCamera2, setUseCamera2] = useState(false);
    const [isCamera1Captured, setIsCamera1Captured] = useState(false);
    const [isCamera2Captured, setIsCamera2Captured] = useState(false);
    const [permGranted, setPermGranted] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [availableDevices, setAvailableDevices] = useState([]);
    const [availableDevicesLoading, setAvailableDevicesLoading] = useState(false);
    const [blockUI, setBlockUI] = useState(false);
    const [dataResult, setDataResult] = useState(null);
    const [typeOfCompare, setTypeOfCompare] = useState('image/image');

    const getDevices = () => {
        setPermGranted(true);
        setAvailableDevicesLoading(true);
        return navigator.mediaDevices.enumerateDevices();
    };

    const gotDevices = (devices) => {
        if (!devices || devices.length === 0) throw "No devices found.";
        console.log(devices);
        const videoDevices = devices.filter(({ kind }) => kind === "videoinput");
        if (!videoDevices || videoDevices.length === 0)
            throw "No video devices found.";
        setAvailableDevices(videoDevices);
        setAvailableDevicesLoading(false);
        return videoDevices;
    };

    const setDefault = (videoDevices) => {
        //if current not existed in available devices=>set to default
        const deviceIds = availableDevices.map((device) => device.deviceId);
        if (!deviceIds.includes(setDeviceId)) setDeviceId(videoDevices[0].deviceId);
    };

    const handleError = (error) => {
        setPermGranted(false);
    };

    useEffect(() => {
        if (useCamera1 || useCamera2) {
            if (!navigator.permissions || !navigator.permissions.query) return;
            console.log("camera")
            navigator.permissions
                .query({ name: "camera" })
                .then((permissionObj) => {
                    setPermGranted(permissionObj.state === "granted");
                    permissionObj.onchange = (e) => {
                        setPermGranted(e.currentTarget.state === "granted");
                    };
                })
                .catch((error) => {
                    console.log("Got error :", error);
                });
        }
    }, [useCamera1, useCamera2]);

    useEffect(() => {
        if (useCamera1 || useCamera2) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                alert("enumerateDevices() not supported.");
                return;
            }
            navigator.mediaDevices
                .getUserMedia({ audio: false, video: true })
                .then(getDevices)
                .then(gotDevices)
                .then(setDefault)
                .catch(handleError);
            navigator.mediaDevices.ondevicechange = (e) => {
                getDevices().then(gotDevices).then(setDefault);
            };
        }
    }, [permGranted, useCamera1, useCamera2]);

    const handleUseCamera1Change = (e) => {
        setUseCamera1(e.target.checked);
        setImage1('');
        setIsCamera1Captured(false);
    }
    const handleUseCamera2Change = (e) => {
        setUseCamera2(e.target.checked);
        setImage2('');
        setIsCamera2Captured(false);
    }

    const onReset = () => {
        setImage1('');
        setImage2('');
        setUrl1('');
        setUrl2('');
        setDataResult(null);
        setIsCamera1Captured(false);
        setIsCamera2Captured(false);
    }

    const handleSelectedImage1Change = (e) => {
        setImage1(e);
        if (!e) {
            setImage1('');
            setIsCamera1Captured(false);
            setDataResult(null);
        }
    }
    const handleSelectedImage2Change = (e) => {
        setImage2(e);
        if (!e) {
            setImage2('');
            setIsCamera2Captured(false);
            setDataResult(null);
        }
    }

    const handleTypeOfCompareChange = (e) => {
        setTypeOfCompare(e.target.value);
        onReset();
    }

    const handleCompare = async () => {
        let postData = null;
        switch (typeOfCompare) {
            case 'image/image': {
                postData = {
                    image1: (useCamera1 && !isCamera1Captured) ? ref1.current.getScreenshot() : image1,
                    image2: (useCamera2 && !isCamera2Captured) ? ref2.current.getScreenshot() : image2
                }
                break;
            }
            case 'url/url': {
                postData = {
                    image1: url1,
                    image2: url2
                }
                break;
            }
            case 'url/image': {
                postData = {
                    image1: url1,
                    image2: (useCamera2 && !isCamera2Captured) ? ref2.current.getScreenshot() : image2
                }
                break;
            }
        }

        // For case user click Compare without capture
        if (useCamera1 && !isCamera1Captured) {
            setImage1(ref1.current.getScreenshot());
            setIsCamera1Captured(true);
        }
        if (useCamera2 && !isCamera2Captured) {
            setImage2(ref2.current.getScreenshot());
            setIsCamera2Captured(true);
        }

        if (!postData.image1 || !postData.image2) {
            toast.error('Please submit two faces to compare.');
            return;
        }
        setBlockUI(true);
        try {
            const result = await API.face.compareFace(postData);
            setDataResult(result);
            setBlockUI(false);
        } catch (error) {
            toast.error("Compare face error. Please contact Simplex AI Services Administrator.");
            setBlockUI(false);
            setDataResult(null);
        }
    }

    const handleCapture = (cameraId) => {
        if (cameraId === 1) {
            setImage1(ref1.current.getScreenshot());
            setIsCamera1Captured(true);
        } else {
            setImage2(ref2.current.getScreenshot());
            setIsCamera2Captured(true);
        }
    }

    return <div className="ne-page-body ne-page-not-found">
        <NextPageHeader
            title="Face Compare Demo"
            icon="far fa-object-ungroup"
            breadcrumb="Demo / Face Compare"
        />
        <BlockUi blocking={blockUI}>
            <Row>
                <Col lg="8">
                    <Card>
                        <Row>
                            <Col md="6">
                                <Flex alignItem="center" justifyContent="end" style={{ height: '42px' }}>
                                    {typeOfCompare === 'image/image' && <NxtTooltip tooltip="You can upload an image or use your camera to capture a face.">
                                        <Form.Group>
                                            <Form.Check className="form-switch d-flex align-items-center" label="Use camera" defaultChecked={useCamera1} onChange={(e) => handleUseCamera1Change(e)} />
                                        </Form.Group>
                                    </NxtTooltip>
                                    }
                                </Flex>

                                {typeOfCompare === 'image/image' && <>
                                    {useCamera1 ? <div className="fs-camera bg-dark mb-3" style={{ height: '360px' }}>
                                        {permGranted ? <BlockUi blocking={availableDevicesLoading}>
                                            {
                                                !isCamera1Captured ? <>
                                                    <Webcam style={{ borderRadius: "5px" }} ref={ref1}
                                                        width="100%"
                                                        height="100%"
                                                        audio={false}
                                                        videoConstraints={{
                                                            deviceId: deviceId ? { exact: deviceId } : undefined,
                                                        }}
                                                    />
                                                    <Form.Control as="select" size="sm" className="form-control form-select camera-select" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
                                                        {availableDevices?.map((item, idx) => {
                                                            return <option value={item.deviceId} key={idx}>{item.label}</option>
                                                        })}
                                                    </Form.Control>
                                                    <button type="button" className="btn-capture" onClick={() => handleCapture(1)}>
                                                        <i className="fas fa-camera"></i>
                                                    </button>
                                                </> :
                                                    <UploadComponent isUploadFile={false} inputData={image1} height={355} onSelectedFileChange={handleSelectedImage1Change} />
                                            }
                                        </BlockUi> :
                                            <div className="text-muted d-flex h-100 justify-content-center align-items-center p-3">
                                                Please grant using camera permission to use camera
                                            </div>
                                        }
                                    </div> :
                                        <UploadComponent isUploadFile={false} inputData={image1} height={355} onSelectedFileChange={handleSelectedImage1Change} />
                                    }
                                </>
                                }
                                {(typeOfCompare.indexOf('url') !== -1) && <div className="d-flex flex-column" style={{ height: '371px' }}>
                                    <Form.Group controlId="ctrlNumberOfResult" className="w-100">
                                        <Form.Label>Image Url</Form.Label>
                                        <Form.Control type="url" placeholder="https://" className="form-control" value={url1} onChange={(e) => setUrl1(e.target.value)} />
                                    </Form.Group>
                                    <div className="image-from-url">
                                        <Image src={url1} preview={false} fallback={DEFAULT_IMAGE} />
                                    </div>
                                </div>}
                            </Col>
                            <Col md="6">
                                <Flex alignItem="center" justifyContent="end">
                                    <NxtTooltip tooltip="You can upload an image or use your camera to capture a face.">
                                        <Form.Group>
                                            <Form.Check className="form-switch d-flex align-items-center" label="Use camera" defaultChecked={useCamera2} onChange={(e) => handleUseCamera2Change(e)} />
                                        </Form.Group>
                                    </NxtTooltip>
                                </Flex>

                                {(typeOfCompare.indexOf('image') !== -1) && <>
                                    {useCamera2 ? <div className="fs-camera bg-dark mb-3" style={{ height: '360px' }}>
                                        {permGranted ? <BlockUi blocking={availableDevicesLoading}>
                                            {!isCamera2Captured ? <>
                                                <Webcam style={{ borderRadius: "5px" }} ref={ref2}
                                                    width="100%"
                                                    height="100%"
                                                    audio={false}
                                                    videoConstraints={{
                                                        deviceId: deviceId ? { exact: deviceId } : undefined,
                                                    }}
                                                />
                                                <Form.Control as="select" size="sm" className="form-control form-select camera-select" value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
                                                    {availableDevices?.map((item, idx) => {
                                                        return <option value={item.deviceId} key={idx}>{item.label}</option>
                                                    })}
                                                </Form.Control>
                                                <button type="button" className="btn-capture" onClick={() => handleCapture(2)}>
                                                    <i className="fas fa-camera"></i>
                                                </button>
                                            </> :
                                                <UploadComponent isUploadFile={false} inputData={image2} height={355} onSelectedFileChange={handleSelectedImage2Change} />
                                            }
                                        </BlockUi> :
                                            <div className="text-muted d-flex h-100 justify-content-center align-items-center p-3">
                                                Please grant using camera permission to use camera
                                            </div>
                                        }
                                    </div> :
                                        <UploadComponent isUploadFile={false} inputData={image2} height={355} onSelectedFileChange={handleSelectedImage2Change} />
                                    }
                                </>
                                }
                                {(typeOfCompare === 'url/url') && <div className="d-flex flex-column" style={{ height: '371px' }}>
                                    <Form.Group controlId="ctrlNumberOfResult" className="w-100">
                                        <Form.Label>Image Url</Form.Label>
                                        <Form.Control type="url" placeholder="https://" className="form-control" value={url2} onChange={(e) => setUrl2(e.target.value)} />
                                    </Form.Group>
                                    <div className="image-from-url">
                                        <Image src={url2} preview={false} fallback={DEFAULT_IMAGE} />
                                    </div>
                                </div>}
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col lg="9" md="8" sm="6" xs="6">
                                <Form.Group controlId="ctrlNumberOfResult" className="mb-0">
                                    <Form.Control as="select" className="form-control form-select" value={typeOfCompare} onChange={(e) => handleTypeOfCompareChange(e)}>
                                        <option value='image/image'>Image Upload / Image Upload</option>
                                        <option value='url/url'>Image Url / Image Url</option>
                                        <option value='url/image'>Image Url / Image Upload</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col lg="3" md="4" sm="6" xs="6">
                                <Button variant="primary" className="px-5 btn-search" type="button" onClick={handleCompare}>Compare</Button>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col lg="4">
                    <Card style={{ height: '485px' }}>
                        <Flex justifyContent="between" className="mb-3">
                            <Nav className="nav-tabs nav-tunnel nav-slider mb-0">
                                <Nav.Item>
                                    <Nav.Link className={`d-flex align-items-center ${selectedTab === 1 ? 'active' : ''}`} type="button" onClick={() => setSelectedTab(1)}>
                                        Compare results
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
                            {dataResult ? <>
                                {selectedTab === 1 ?
                                    <div className="tab-pane bd-heading-1 fade show active" id="content-results" role="tabpanel" aria-labelledby="tab-results">
                                        <div className="fa-demo-tab-pane-body count-up d-flex align-items-center justify-content-center flex-column" style={{ height: '300px' }}>
                                            <h4 style={{ color: dataResult.match ? 'green' : 'red' }}>{dataResult.match ? 'MATCH' : 'NOT MATCH'}</h4>
                                            {dataResult?.similarity_score ?
                                                <h1 style={{ color: dataResult.match ? 'green' : 'red' }}>
                                                    <b><CountUp suffix="%" duration={1} end={dataResult.similarity_score * 100} /></b>
                                                </h1> :
                                                <span>0</span>}
                                        </div>
                                    </div> : <div className="tab-pane bd-heading-1 fade show active" id="content-json" role="tabpanel" aria-labelledby="tab-json">
                                        <div className="fa-demo-tab-pane-body bg-dark text-white" style={{ height: '300px' }}>
                                            {dataResult && <ReactJson
                                                theme="bright"
                                                src={dataResult}
                                                iconStyle="square"
                                                enableClipboard={false}
                                                displayObjectSize={false}
                                                displayDataTypes={false} />
                                            }
                                        </div>
                                    </div>
                                }
                            </> :
                                <div className="tab-pane bd-heading-1 fade show active">
                                    <div className="fa-demo-tab-pane-body align-items-center justify-content-center d-flex" style={{ height: '300px' }}>
                                        <small className="text-muted">
                                            Please submit two faces to compare.
                                        </small>
                                    </div>
                                </div>
                            }
                        </div>
                    </Card>
                </Col>
            </Row>
        </BlockUi>
    </div>
}
export default DemoFaceComparePage;