import { Card } from "antd";
import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Nav } from 'react-bootstrap';
import { toast } from "react-toastify";
import NextPageHeader from "../../../components/NxtPageHeader";
import Flex from "../../../components/Flex";
import UploadComponent from "../../../components/UploadComponent";
import { MESSAGES } from "../../../constants/message";
import API from "../../../services/API";
import BlockUi from 'react-block-ui';
import ReactJson from "react-json-view";
import NxtTooltip from "../../../components/Tooltip";
import CountUp from 'react-countup';
import { AsyncPaginate } from 'react-select-async-paginate';
import { ITEMS_PER_PAGE } from "../../../constants/app";
import ManageVoicePage from "../../Customer/Voice";
import AudioReactRecorder, { RecordState } from 'audio-react-recorder'

const DemoVoiceMatchPage = () => {
    const [validated, setValidated] = useState(false);
    const [blockUI, setBlockUI] = useState(false);
    const [audio, setAudio] = useState('');
    const [selectedTab, setSelectedTab] = useState(1);
    const [dataResult, setDataResult] = useState(null);
    const [selectedAudio, setSelectedAudio] = useState(null);

    const [useAudio, setUseAudio] = useState(false);
    const [permGranted, setPermGranted] = useState(false);
    const [deviceId, setDeviceId] = useState("");
    const [availableDevices, setAvailableDevices] = useState([]);


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
    async function loadOptions(search, loadedOptions, { page }) {
        const response = await API.voice.search({
            page: page,
            pagesize: ITEMS_PER_PAGE
        });
        return {
            options: response.data.map((item) => {
                return { value: item.id, label: item.name }
            }),
            hasMore: response.total > page * ITEMS_PER_PAGE,
            additional: {
                page: page + 1,
            },
        };
    }

    const handleSelectedFileChange = (e) => {
        setAudio(e);
        setDataResult(null);
    }
    const onReset = () => {
        setAudio(null);
        setSelectedAudio(null);
        setDataResult(null);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setValidated(true);
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            return
        }
        if (!useAudio && (!selectedAudio || !audio)) {
            toast.error("Please select audio to verify.");
            return
        }
        try {
            if (useAudio) {
                const reader = new FileReader();
                reader.readAsDataURL(audioData.blob);
                reader.onloadend = async (res) => {
                    const audioResult = res.currentTarget.result;
                    var postData = {
                        id: selectedAudio.value,
                        audio: audioResult.split(',')[1]
                    };

                    const result = await API.voice.compareVoice(postData);
                    setBlockUI(false);
                    setDataResult(result);
                };
            } else {
                var postData = {
                    id: selectedAudio.value,
                    audio: audio.split(',')[1]
                };
                const result = await API.voice.compareVoice(postData);
                setBlockUI(false);
                setDataResult(result);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || MESSAGES.AnErrorOccurred);
            setBlockUI(false);
            setDataResult(null);
        }
    };

    return <div className="ne-page-body ne-page-voice-form">
        <BlockUi blocking={blockUI}>
            <NextPageHeader
                title="Voice Match Demo"
                icon="fas fa-microphone-alt"
                breadcrumb="Demo / Voice Match"
            />

            <Row>
                <Col lg="6">
                    <Card className="mb-3">
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                            <div className="d-flex justify-content-between">
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

                            <div>
                                {useAudio ? <div className="fs-camera mb-0 mt-2" style={{ height: 'auto' }}>
                                    {permGranted ? <div className="d-flex flex-wrap mb-2" style={{ rowGap: '10px', columnGap: '16px' }}>
                                        <div>
                                            <AudioReactRecorder backgroundColor="#f1f3f4" foregroundColor="#0d6efd" state={recordState} onStop={onStop} canvasHeight={54} canvasWidth={300} />
                                            <div className="audio-recorder-control text-center mt-2 pt-1">
                                                    <button type="button" className="btn btn-sm btn-secondary mr-2" onClick={() => handleStartRecord()}>Start</button>
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
                                    <UploadComponent showRemove={true} isUploadFile={false} isAudio={true} inputData={audio} onSelectedFileChange={handleSelectedFileChange} height={189} />
                                }
                            </div>
                            <div className="mt-4 mb-3 text-center">
                                <Row>
                                    <Col lg="9" md="8" sm="6" xs="6">
                                        <AsyncPaginate
                                            className="controlSelect"
                                            value={selectedAudio}
                                            loadOptions={loadOptions}
                                            onChange={setSelectedAudio}
                                            additional={{
                                                page: 1,
                                            }}
                                        />
                                    </Col>
                                    <Col lg="3" md="4" sm="6" xs="6">
                                        <Button variant="primary" className="px-4 w-100 btn-search" type="button" onClick={handleSubmit}>Verify</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </Card>
                </Col>
                <Col lg="6">
                    <Card style={{ height: '393px' }}>
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
                            <NxtTooltip tooltip="Reset">
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
                                            <h4 style={{ color: dataResult.pass ? 'green' : 'red' }}>{dataResult.pass ? 'MATCH' : 'NOT MATCH'}</h4>
                                            {dataResult?.score ?
                                                <h1 style={{ color: dataResult.pass ? 'green' : 'red' }}>
                                                    <b><CountUp suffix="%" duration={1} end={dataResult.score * 100} /></b>
                                                </h1> :
                                                <span>0</span>}
                                        </div>
                                    </div> : <div className="tab-pane bd-heading-1 fade show active" id="content-json" role="tabpanel" aria-labelledby="tab-json">
                                        <div className="fa-demo-tab-pane-body bg-dark text-white" style={{ height: '272px' }}>
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
                                    <div className="fa-demo-tab-pane-body align-items-center justify-content-center d-flex" style={{ height: '272px' }}>
                                        <small className="text-muted">
                                            Please submit your audio to verify.
                                        </small>
                                    </div>
                                </div>
                            }
                        </div>
                    </Card>
                </Col>
            </Row>


            <div className="mt-5">
                <ManageVoicePage />
            </div>
        </BlockUi>
    </div>
}
export default DemoVoiceMatchPage;