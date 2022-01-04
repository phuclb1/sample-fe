import { useEffect, useRef, useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import Webcam from "react-webcam";
import Flex from "../../components/Flex";
import UploadComponent from "../../components/UploadComponent";
import API from "../../services/API";
import BlockUi from 'react-block-ui';
import NxtTooltip from "../../components/Tooltip";

const AddImageToCollectionModal = ({ show, onDismiss, selectedGroup }) => {
    const ref = useRef(null);
    const [blockUI, setBlockUI] = useState(false);
    const [validated, setValidated] = useState(false);
    const [useCamera, setUseCamera] = useState(false);
    const [faceGroups, setFaceGroups] = useState([]);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [groupId, setGroupId] = useState(null);
    const [capturedImageSource, setCapturedImageSource] = useState(null);
    const [permGranted, setPermGranted] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [availableDevices, setAvailableDevices] = useState([]);
    const [availableDevicesLoading, setAvailableDevicesLoading] = useState(false);

    const loadFaceGroups = async () => {
        try {
            const res = await API.faceGroup.getFaceGroup();
            setFaceGroups(res.data);
        } catch (error) {
            toast.error("Load face group error. " + error?.response?.data?.message);
        }
    }

    useEffect(() => {
        loadFaceGroups();
    }, [])

    useEffect(() => {
        setName('');
        setDesc('');
        setCapturedImageSource('');
        setValidated(false);
        setUseCamera(false);
        setGroupId(selectedGroup);
    }, [show])

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

    const handleSelectedFileChange = (e) => {
        setCapturedImageSource(e);
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
            const imageSrc = useCamera ? ref.current.getScreenshot() : capturedImageSource;
            if (!imageSrc) {
                toast.error('Please submit an image or use your camera to capture a face.');
                return;
            }
            const res = await API.faceGroup.addFaceGroup(groupId, name, desc, imageSrc);
            switch (res.code) {
                case 200: {
                    toast.success("Add face group success.");
                    onDismiss(groupId);
                    break;
                }
                case 201: {
                    toast.error("No face detected.");
                    break;
                }
                case 202: {
                    toast.error("Multi face detected");
                    break;
                }
                default: {
                    toast.error("Add face group failed.");
                    break;
                }
            }

            setBlockUI(false);
        } catch (error) {
            toast.error("Add face group error. " + error?.response?.data?.message);
            setBlockUI(false);
        }
    };

    return (
        <Modal show={show} onHide={onDismiss} size="lg" dialogClassName="modal-cus-lg" centered id="addFaceImageModal">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <BlockUi blocking={blockUI}>
                    <Modal.Header closeButton>
                        <Flex flexWrap={true} alignItem="center" justifyContent="between" className="w-100">
                            <Modal.Title as="h5">Add face to collection</Modal.Title>
                            <NxtTooltip tooltip="You can upload an image or use your camera to capture a face.">
                                <Form.Group>
                                    <Form.Check className="form-switch d-flex align-items-center me-4" label="Use camera" defaultChecked={useCamera} onChange={(e) => setUseCamera(e.target.checked)} />
                                </Form.Group>
                            </NxtTooltip>
                        </Flex>
                    </Modal.Header>
                    <Modal.Body>
                        {useCamera ? <div className="fs-camera bg-dark mb-3" style={{ height: '320px' }}>
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
                        </div> : <UploadComponent onSelectedFileChange={handleSelectedFileChange} />}
                        <Row className="mt-3">
                            <Col className="col-md-6">
                                <Form.Group className="mb-3" controlId="ctrlName">
                                    <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" required value={name} onChange={(e) => setName(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        Name is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group className="mb-3" controlId="ctrlFaceGroup">
                                    <Form.Label>Face group <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="select" className="form-control form-select" required value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                                        {faceGroups?.map((item, idx) => {
                                            return <option value={item.id} key={idx}>{item.name}</option>
                                        })}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Face group is required.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
                            </Form.Group>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" variant="primary" className="btn-soft-primary px-4" onClick={onDismiss}>Close</Button>
                        <Button type="submit" variant="primary" className="px-5">Save</Button>
                    </Modal.Footer>
                </BlockUi>
            </Form>
        </Modal>
    )
}

export default AddImageToCollectionModal;