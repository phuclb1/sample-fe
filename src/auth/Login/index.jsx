import { Col, Row, Button, Form } from 'react-bootstrap';
import React, { useState } from 'react';
import './index.css';
import NxtCard from '../../components/NxtCard';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/actions/userAction';

const LoginPage = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(login(username, password, true));
    }

    return <div className="ne-auth-page ne-login-page">
        <div className="container">
            <Row className="justify-content-center">
                <Col xs="11" md="6" lg="5">
                    <div className="ne-card-auth">
                        <div className="text-center mb-5">
                            <img src="/images/simplex-logo.png" width="320" alt="Simplex AI Services" />
                        </div>
                        <NxtCard title="Login">
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="ctrlUsername">
                                    <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                                    <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} maxLength={255} required={true} type="text" />
                                </Form.Group>
                                <Form.Group controlId="ctrlPassword">
                                    <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                                    <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} maxLength={255} required={true} type="password" />
                                </Form.Group>
                                <hr />
                                <div className="mt-3 pb-2">
                                    <Button variant="primary" type="submit" className="px-4">Login</Button>
                                </div>
                            </Form>
                        </NxtCard>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
}

export default LoginPage;