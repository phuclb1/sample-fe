import { Card } from "antd";
import { useEffect, useState } from "react";
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import NextPageHeader from "../../../../components/NxtPageHeader";
import UploadComponent from "../../../../components/UploadComponent";
import { ROUTES } from "../../../../constants/app";
import { MESSAGES } from "../../../../constants/message";
import { history } from "../../../../router/history";
import API from "../../../../services/API";
import BlockUi from 'react-block-ui';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'
import NxtTooltip from "../../../../components/Tooltip";
import _ from 'lodash';

const VoiceForm = (props) => {
    const [currentId, setCurrentId] = useState(null);
    const [validated, setValidated] = useState(false);
    const [blockUI, setBlockUI] = useState(false);

    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [audio, setAudio] = useState('');
    const [audios, setAudios] = useState([]);
    const [bbox, setBbox] = useState('');
    const [useAudio, setUseAudio] = useState(false);
    const [permGranted, setPermGranted] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [availableDevices, setAvailableDevices] = useState([]);

    useEffect(async () => {
        if (props?.match?.params?.id) {
            const res = await API.voice.getById(props.match.params.id);
            if (res) {
                setCurrentId(res.id);
                setName(res.name || '');
                setCode(res.code || '');
                setAudio(res.audios[0]);
                setAudios(res.audios);
                setBbox(res.bbox);
            } else {
                history.push(ROUTES.PAGE_NOT_FOUND);
            }
        }
    }, [props])

    const handleSelectedFileChange = (e) => {
        setAudio(e);
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
        var postData = {
            'name': name
        };
        try {
            setBlockUI(true);
            if (!currentId) {
                if (useAudio) {
                    const reader = new FileReader();
                    reader.readAsDataURL(audioData.blob);
                    reader.onloadend = async (res) => {
                        const audioResult = res.currentTarget.result;
                        postData['code'] = code;
                        postData['audios'] = [audioResult.split(',')[1]];
                        try {
                            await API.voice.create(postData);
                            toast.success(MESSAGES.CreateSuccess);
                            setBlockUI(false);
                            history.push(ROUTES.VOICE_MATCH_DEMO);
                        } catch (error) {
                            console.error(error);
                            toast.error(error?.response?.data?.message || MESSAGES.AnErrorOccurred);
                            setBlockUI(false);
                        }
                    };
                } else {
                    if (!audio) {
                        return
                    }
                    let newAudios = [];
                    _.each(audio, (a) => {
                        newAudios.push(a.split(',')[1]);
                    })
                    postData['code'] = code;
                    postData['audios'] = newAudios;
                    await API.voice.create(postData);
                    toast.success(MESSAGES.CreateSuccess);
                    setBlockUI(false);
                    history.push(ROUTES.VOICE_MATCH_DEMO);
                }
            } else {
                await API.voice.update(currentId, postData);
                toast.success(MESSAGES.UpdateSuccess);
                setBlockUI(false);
                history.push(ROUTES.VOICE_MATCH_DEMO);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || MESSAGES.AnErrorOccurred);
            setBlockUI(false);
        }
    };


    const handleBackClick = () => {
        history.push(ROUTES.VOICE_MATCH_DEMO);
    }

    const getDevices = () => {
        setPermGranted(true);
        return navigator.mediaDevices.enumerateDevices();
    };

    const gotDevices = (devices) => {
        if (!devices || devices.length === 0) throw "No devices found.";
        console.log(devices);
        const audioDevices = devices.filter(({ kind }) => kind === "audioinput");
        if (!audioDevices || audioDevices.length === 0)
            throw "No audio devices found.";
        setAvailableDevices(audioDevices);
        return audioDevices;
    };

    const setDefault = (audioDevices) => {
        //if current not existed in available devices=>set to default
        const deviceIds = availableDevices.map((device) => device.deviceId);
        if (!deviceIds.includes(setDeviceId)) setDeviceId(audioDevices[0].deviceId);
    };

    const handleError = (error) => {
        setPermGranted(false);
    };

    useEffect(() => {
        if (useAudio) {
            if (!navigator.permissions || !navigator.permissions.query) return;
            navigator.permissions
                .query({ name: "audio" })
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
    }, [useAudio]);

    useEffect(() => {
        if (useAudio) {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
                alert("enumerateDevices() not supported.");
                return;
            }
            navigator.mediaDevices
                .getUserMedia({ audio: true, video: false })
                .then(getDevices)
                .then(gotDevices)
                .then(setDefault)
                .catch(handleError);
            navigator.mediaDevices.ondevicechange = (e) => {
                getDevices().then(gotDevices).then(setDefault);
            };
        }
    }, [useAudio, permGranted]);

    const [recordState, setRecordState] = useState(null);
    const [audioData, setAudioData] = useState(null);

    const onStop = (audioData) => {
        console.log('audioData', audioData)
        setAudioData(audioData);
    }
    const handleStartRecord = () => {
        setRecordState(RecordState.START);
        window.setTimeout(() => {
            setRecordState(RecordState.STOP);
        }, 5000)
    }
    return <div className="ne-page-body ne-page-voice-form">
        <BlockUi blocking={blockUI}>
            <NextPageHeader
                title={`${currentId ? 'Update Voice' : 'Add New Voice'}`}
                icon="far fa-file-audio"
                breadcrumb={`Voices / ${currentId ? 'Update' : 'Add new'}`}
                header_action_icon="fas fa-arrow-left"
                header_action_class="btn-light text-muted ml-3"
                header_action="Back to list"
                onHeaderClick={() => handleBackClick()}
            />
            <Card className="mb-3">
                <h5 className="mb-3">Voice information</h5>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Col lg="4" md="6">
                            <Form.Group controlId="ctrlName">
                                <Form.Label>Name <span>*</span></Form.Label>
                                <Form.Control required value={name} onChange={(e) => setName(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Name is required.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="ctrlCode">
                                <Form.Label>Code</Form.Label>
                                <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} readOnly={currentId} />
                            </Form.Group>
                        </Col>
                        <Col lg="8" md="6" className="px-xl-5">
                            <div className="d-flex">
                                <Form.Group controlId="ctrlAudio" className="mb-0 mr-5">
                                    <Form.Label>Voice <span>*</span></Form.Label>
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <NxtTooltip tooltip="You can upload an voice or use your audio to record.">
                                        <Form.Group>
                                            <Form.Check className="form-switch d-flex align-items-center me-4" label="Use audio record" defaultChecked={useAudio} onChange={(e) => setUseAudio(e.target.checked)} />
                                        </Form.Group>
                                    </NxtTooltip>
                                </div>
                            </div>
                            {
                                currentId ? <div style={{ width: '400px', maxWidth: '100%' }}>
                                    {
                                        audios?.map((a, i) => {
                                            return <audio key={i} className="w-100" controls="controls" autobuffer="autobuffer">
                                                <source src={API.customer.getResource(a)} />
                                            </audio>
                                        })
                                    }
                                </div> : <>
                                    {useAudio ? <div className="fs-camera mb-0 mt-2" style={{ height: 'auto' }}>
                                        {permGranted ? <div className="d-flex flex-wrap mb-2" style={{ rowGap: '10px', columnGap: '16px' }}>
                                            <div>
                                                <AudioReactRecorder backgroundColor="#f1f3f4" foregroundColor="#0d6efd" state={recordState} onStop={onStop} canvasHeight={54} canvasWidth={300} />
                                                <div className="audio-recorder-control text-center mt-2 pt-1">
                                                    <button type="button" className="btn btn-sm btn-secondary mr-2" onClick={() => setRecordState(RecordState.START)}>Start</button>
                                                    {/* <button type="button" className="btn btn-sm btn-secondary mr-2" disabled={recordState !== RecordState.START} onClick={() => setRecordState(RecordState.PAUSE)}>Pause</button> */}
                                                    <button type="button" className="btn btn-sm btn-secondary" disabled={recordState !== RecordState.START && recordState !== RecordState.PAUSE} onClick={() => setRecordState(RecordState.STOP)}>Stop</button>
                                                </div>
                                            </div>
                                            <audio id='audio' controls src={audioData ? audioData.url : null}></audio>

                                        </div> : <div className="text-muted d-flex h-100 justify-content-center align-items-center p-3">
                                            Please grant using audio permission to use audio record
                                        </div>
                                        }
                                    </div> :
                                        <UploadComponent multiple={true} showRemove={!currentId} isUploadFile={false} isAudio={true} bbox={bbox} inputData={audio} onSelectedFileChange={handleSelectedFileChange} height={120} style={{ maxWidth: '400px' }} />
                                    }
                                </>
                            }
                        </Col>
                    </Row>
                    <div className="mt-3">
                        <Button type="submit" variant="primary">Enrollment</Button>
                    </div>
                </Form>
            </Card>
        </BlockUi>
    </div>
}
export default VoiceForm;