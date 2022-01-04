import { useEffect, useRef, useState } from "react";
import { Button, Col, Form, Nav, Row } from "react-bootstrap";
import Flex from "../../../components/Flex";
import NextPageHeader from "../../../components/NxtPageHeader";
import UploadComponent from "../../../components/UploadComponent";
import FaceSearchResult from "./FaceSearchResult";
import Webcam from "react-webcam";
import { toast } from "react-toastify";
import API from "../../../services/API";
import { NUM_OF_SEARCH_RESULT } from "../../../constants/app";
import BlockUi from 'react-block-ui';
import NxtTooltip from "../../../components/Tooltip";
import { Card } from 'antd';

const DemoFaceSearchPage = () => {
    const ref = useRef(null);
    const [dataResult, setDataResult] = useState(null);
    const [inputData, setInputData] = useState('');
    const [tempInputData, setTempInputData] = useState('');
    const [useCamera, setUseCamera] = useState(false);
    const [permGranted, setPermGranted] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [availableDevices, setAvailableDevices] = useState([]);
    const [availableDevicesLoading, setAvailableDevicesLoading] = useState(false);
    const [numberOfResult, setNumberOfResult] = useState(NUM_OF_SEARCH_RESULT[0].value);
    const [blockUI, setBlockUI] = useState(false);

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
        if (useCamera) {
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
    }, [useCamera]);

    useEffect(() => {
        if (useCamera) {
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
    }, [permGranted, useCamera]);

    const handleSearch = async () => {
        const imageSrc = useCamera ? ref.current.getScreenshot() : tempInputData;
        if (!imageSrc) {
            toast.error('Please submit an image or use your camera to capture a face.');
            return;
        }
        setInputData(imageSrc);
        setBlockUI(true);
        try {
            const postData = {
                image: imageSrc,
                limit: Number(numberOfResult)
            }
            const result = await API.face.searchFace(postData);
            setDataResult(result);
            setBlockUI(false);
        } catch (error) {
            toast.error("Search face error. " + error?.response?.data?.message);
            setTimeout(() => {
                setBlockUI(false);
                setDataResult(null);
            }, 1000)
        }
    }

    const handleSelectedFileChange = (e) => {
        setTempInputData(e);
        if (!e) {
            setInputData('');
            setDataResult(null);
        }
    }

    const handleResetSearch = () => {
        setDataResult(null);
        setInputData(null);
        setTempInputData('');
    }

    const handleUseCameraChange = (e) => {
        setUseCamera(e.target.checked);
    }

    return <div className="ne-page-body ne-page-not-found">
        <NextPageHeader
            title="Face Search Demo"
            icon="fas fa-search"
            breadcrumb="Demo / Face Search"
        />
        <Row>
            <Col lg="6" xl="6" className="col-xxl-4">
                <Card>
                    <Flex alignItem="center" justifyContent="between">
                        <h4 className="mb-2">Face Search</h4>
                        <Flex alignItem="center" justifyContent="end">
                            <NxtTooltip tooltip="You can upload an image or use your camera to capture a face.">
                                <Form.Group>
                                    <Form.Check className="form-switch d-flex align-items-center" label="Use camera" defaultChecked={useCamera} onChange={(e) => handleUseCameraChange(e)} />
                                </Form.Group>
                            </NxtTooltip>
                        </Flex>
                    </Flex>
                    <div className="tab-content pt-3">
                        <div className="tab-pane bd-heading-1 fade show active" id="content-search" role="tabpanel" aria-labelledby="tab-search">
                            <div className="fa-demo-tab-pane-body" style={{ overflow: 'initial', minHeight: '430px', height: 'auto' }}>
                                {useCamera ? <div className="fs-camera bg-dark mb-3" style={{ height: '360px' }}>
                                    {permGranted ? <BlockUi blocking={availableDevicesLoading}>
                                        <Webcam style={{ borderRadius: "5px" }} ref={ref}
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
                                    </BlockUi> : <div className="text-muted d-flex h-100 justify-content-center align-items-center p-3">
                                        Please grant using camera permission to use camera
                                    </div>
                                    }
                                </div> : <UploadComponent isUploadFile={false} inputData={inputData} height={360} onSelectedFileChange={handleSelectedFileChange} />}
                                <div className="form-group mt-3">
                                    <Row>
                                        <Col lg="9" md="8" sm="6" xs="6">
                                            <Form.Group controlId="ctrlNumberOfResult" className="mb-0">
                                                <Form.Control as="select" className="form-control form-select" value={numberOfResult} onChange={(e) => setNumberOfResult(e.target.value)}>
                                                    {NUM_OF_SEARCH_RESULT?.map((item, idx) => {
                                                        return <option value={item.value} key={idx}>{item.label}</option>
                                                    })}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col lg="3" md="4" sm="6" xs="6">
                                            <Button variant="primary" className="px-4 w-100 btn-search" type="button" onClick={handleSearch}>Search</Button>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
            <Col lg="6" xl="6" className="mt-lg-0 mt-4 col-xxl-4">
                <BlockUi blocking={blockUI}>
                    <FaceSearchResult results={dataResult} onReset={handleResetSearch} />
                </BlockUi>
            </Col>
        </Row>
    </div>
}
export default DemoFaceSearchPage;