import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, Col, Container, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import Menu from "../../components/Menu";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientLogin = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchClient();
    }, [id])

    const fetchClient = () => {
        axios.get('http://127.0.0.1:8000/api/clients/' + id)
            .then((response) => {
                setUsername(response.data.username);
                setPassword(response.data.password);
            }).catch((error) => {
            console.log(error);
        });
    }

    const onFormSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        const isValid = form.checkValidity();
        setValidated(true);

        if (!isValid) {
            return;
        }
        doLogin();
    }
    const doLogin = () => {
        axios.post('http://127.0.0.1:8000/api/clients/login', {
            username: username,
            password: password
        }).then((response) => {
            if(response.data.access_token){
                localStorage.setItem('token', 'Bearer ' + response.data.access_token);
                localStorage.setItem('username', username);
                localStorage.setItem('propietario', response.data.propietario);
                localStorage.setItem('client_id', response.data.client_id);
                navigate('/');
            }else{
                toast.error('Usuario o contraseña incorrectos');
            }
        }).catch((error) => {
            console.log(error);
            toast.error('Usuario o contraseña incorrectos');
        });
    }

    return (
        <>
            <Menu />
            <Container>
                <Row className="mt-3 mb-3">
                    <Col md={{
                        span: 6,
                        offset: 3
                    }}>
                        <Card >
                            <CardBody>
                                <CardTitle>
                                    <h3>Inicia Sesion</h3>
                                </CardTitle>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <div>
                                        <FormLabel>Username</FormLabel>

                                        <FormControl required type="text" value={username}
                                                     onChange={(e) => {
                                                         setUsername(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escribe tu Username
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Password</FormLabel>

                                        <FormControl required type="password" value={password}
                                                     onChange={(e) => {
                                                         setPassword(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escribe tu contrasena
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <Button className="mt-5" variant="primary" type="submit">Guardar</Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
}

export default ClientLogin;