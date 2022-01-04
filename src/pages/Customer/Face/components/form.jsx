import { Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import NextPageHeader from "../../../../components/NxtPageHeader";
import UploadComponent from "../../../../components/UploadComponent";
import { ROUTES } from "../../../../constants/app";
import { MESSAGES } from "../../../../constants/message";
import { history } from "../../../../router/history";
import API from "../../../../services/API";
import BlockUi from 'react-block-ui';
import Webcam from "react-webcam";
import NxtTooltip from "../../../../components/Tooltip";

const FaceForm = (props) => {
    const ref = useRef(null);
    const [currentId, setCurrentId] = useState(null);
    const [validated, setValidated] = useState(false);
    const [blockUI, setBlockUI] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [image, setImage] = useState('');
    const [bbox, setBbox] = useState('');
    const [description, setDescription] = useState('');
    const [useCamera, setUseCamera] = useState(false);
    const [permGranted, setPermGranted] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [availableDevices, setAvailableDevices] = useState([]);
    const [availableDevicesLoading, setAvailableDevicesLoading] = useState(false);

    useEffect(async () => {
        if (props?.match?.params?.id) {
            const res = await API.face.getById(props.match.params.id);
            if (res) {
                setCurrentId(res.id);
                setName(res.name || '');
                setCode(res.code || '');
                setDescription(res.description || '');
                setImage(res.root_image);
                setBbox(res.bbox);
            } else {
                history.push(ROUTES.PAGE_NOT_FOUND);
            }
        }
    }, [props])

    const handleSelectedFileChange = (e) => {
        setImage(e);
        setBbox(null);
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            return
        }

        try {
            setBlockUI(true);
            if (!currentId) {
                const imageSrc = useCamera ? ref.current.getScreenshot() : image;
                if (!imageSrc) {
                    return
                }
                var postData = {
                    'name': name,
                    'description': description,
                    'code': code,
                    'image': imageSrc
                };
                await API.face.create(postData);
                toast.success(MESSAGES.CreateSuccess);
            } else {
                var formData = new FormData();
                formData.append("name", name);
                formData.append("description", description);
                await API.face.update(currentId, formData);
                toast.success(MESSAGES.UpdateSuccess);
            }
            setBlockUI(false);
            history.push(ROUTES.FACES);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || MESSAGES.AnErrorOccurred);
            setBlockUI(false);
        }
    };


    const handleBackClick = () => {
        history.push(ROUTES.FACES);
    }

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
    }, [useCamera, permGranted]);


    return <div className="ne-page-body ne-page-face-form">
        <BlockUi blocking={blockUI}>
            <NextPageHeader
                title={`${currentId ? 'Update Face' : 'Add New Face'}`}
                icon="fas fa-expand"
                breadcrumb={`Faces / ${currentId ? 'Update' : 'Add new'}`}
                header_action_icon="fas fa-arrow-left"
                header_action_class="btn-light text-muted ml-3"
                header_action="Back to list"
                onHeaderClick={() => handleBackClick()}
            />
            <Card className="mb-3">
                <h5 className="mb-3">Face information</h5>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Col lg="4" md="6">
                            <Form.Group controlId="ctrlName">
                                <Form.Label>Full Name <span>*</span></Form.Label>
                                <Form.Control required value={name} onChange={(e) => setName(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Fullname is required.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="ctrlCode">
                                <Form.Label>Code</Form.Label>
                                <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} readOnly={currentId} />
                            </Form.Group>

                            <Form.Group controlId="ctrlDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col lg="4" md="6" className="px-xl-5">
                            {currentId ? <Form.Group controlId="ctrlImage" className="mb-0">
                                <Form.Label>Face Image <span>*</span></Form.Label>
                            </Form.Group> : <div className="d-flex justify-content-end">
                                <NxtTooltip tooltip="You can upload an image or use your camera to capture a face.">
                                    <Form.Group>
                                        <Form.Check className="form-switch d-flex align-items-center me-4" label="Use camera" defaultChecked={useCamera} onChange={(e) => setUseCamera(e.target.checked)} />
                                    </Form.Group>
                                </NxtTooltip>
                            </div>}

                            {useCamera ? <div className="fs-camera bg-dark mb-3" style={{ height: '290px' }}>
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
                            </div> : <UploadComponent showRemove={!currentId} isUploadFile={false} bbox={bbox} inputData={API.customer.getResource(image)} onSelectedFileChange={handleSelectedFileChange} height={300} />}
                        </Col>
                    </Row>
                    <div className="mt-3">
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </div>
                </Form>
            </Card>
        </BlockUi>
    </div>
}
export default FaceForm;