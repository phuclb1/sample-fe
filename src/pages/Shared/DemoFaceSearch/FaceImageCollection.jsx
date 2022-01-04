import { useEffect, useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import AddImageToCollectionModal from "../../../components/AddImageToCollectionModal";
import FaceImageDetailModal from "../../../components/FaceImageDetailModal";
import CollactionItem from "./CollactionItem";
import BlockUi from 'react-block-ui';
import API from "../../../services/API";
import { toast } from "react-toastify";

const FaceImageCollection = ({ faceGroups }) => {
    const [blockUI, setBlockUI] = useState(false);
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("");

    useEffect(() => {
        if (faceGroups && faceGroups.length > 0) {
            setSelectedGroup(faceGroups[0].value);
            loadFaceImageByGroup(faceGroups[0].value);

        }
    }, [faceGroups])

    const loadFaceImageByGroup = async (groupId) => {
        try {
            const res = await API.faceGroup.getFaceImageByGroup(groupId);
            setImages(res.data);
            setBlockUI(false);
        } catch (error) {
            toast.error("Load face group error. " + error?.response?.data?.message);
            setImages([]);
            setBlockUI(false);
        }
    }

    const handleOpenAddModal = () => {
        if (!selectedGroup) {
            return;
        }
        setShowModal(true);
    }

    const handleCloseAddModal = (e) => {
        setShowModal(false);
        if (e) {
            setSelectedGroup(e);
            loadFaceImageByGroup(e);
        }
    }

    const handleOpenDetailModal = (item) => {
        setSelectedItem(item);
        setShowDetailModal(true);
    }

    const handleCloseDetailModal = (e) => {
        setShowDetailModal(false);
        setSelectedItem(null);
    }

    const hanleRemove = async (id) => {
        if (!id) return;
        try {
            setBlockUI(true);
            await API.faceGroup.deleteFaceImage(id);
            setBlockUI(false);
            loadFaceImageByGroup(selectedGroup);
        } catch (error) {
            toast.error("Load face group error. " + error?.response?.data?.message);
            setBlockUI(false);
        }
    }

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
        loadFaceImageByGroup(e.target.value);
    }
    return <>
        <div className="fs-album">
            <BlockUi blocking={blockUI}>
                <Row>
                    {images && images.length > 0 ? images.map((item, idx) => {
                        return <Col key={item.id} md="4">
                            <CollactionItem data={item} onOpen={() => handleOpenDetailModal(item)} onRemove={() => hanleRemove(item.id)} />
                        </Col>
                    }) : <>
                        {!blockUI && <Col lg="12"><div className="pt-5"><small className="text-muted">No image found.</small></div></Col>}
                    </>}
                </Row>
            </BlockUi>
        </div>
        <div className="mt-3 d-flex">
            <Form.Group controlId="ctrlFaceGroup">
                <Form.Control as="select" className="form-control form-select pe-5" value={selectedGroup} onChange={handleGroupChange}>
                    {faceGroups?.map((item, idx) => {
                        return <option value={item.value} key={idx}>{item.label}</option>
                    })}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" className="px-4 ms-3" type="button" onClick={handleOpenAddModal}>Add more</Button>
        </div>
        <FaceImageDetailModal show={showDetailModal} faceGroups={faceGroups} onDismiss={handleCloseDetailModal} data={selectedItem} />
        <AddImageToCollectionModal show={showModal} selectedGroup={selectedGroup} onDismiss={handleCloseAddModal} />
    </>
}
export default FaceImageCollection;