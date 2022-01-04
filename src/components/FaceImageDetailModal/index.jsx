import { Modal, Form, Row, Col, Image } from "react-bootstrap";
import { DEFAULT_IMAGE } from "../../constants/app";

const FaceImageDetailModal = ({ show, onDismiss, data }) => {
    return <Modal show={show} onHide={onDismiss} size="lg" dialogClassName="modal-cus-lg modal-dialog-scrollable" centered id="detailModal">
        <Modal.Header closeButton>
            <Modal.Title as="h5">{data?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Image src={data?.image || DEFAULT_IMAGE} className="w-100" alt={data?.name} onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE }} />
            <Row className="mt-3">
                <Col className="col-md-6">
                    <Form.Group className="mb-3" controlId="ctrlName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" readOnly defaultValue={data?.name} />
                    </Form.Group>
                </Col>
                <Form.Group className="mb-3" controlId="ctrlDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={2} readOnly defaultValue={data?.description} />
                </Form.Group>
            </Row>
        </Modal.Body>
    </Modal>
}
export default FaceImageDetailModal;