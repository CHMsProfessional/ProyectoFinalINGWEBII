import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, Col, Container, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import Menu from "../../components/Menu";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClientRegister = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [propietario, setPropietario] = useState(false);

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchClient();
    }, [id])

    const fetchClient = () => {
        axios.get('http://127.0.0.1:8000/api/clients/' + id)
            .then((response) => {
                setNombre(response.data.nombre);
                setApellido(response.data.apellido);
                setUsername(response.data.username);
                setPassword(response.data.password);
                setEmail(response.data.email);
                setPropietario(response.data.propietario);
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
        doSave();
    }
    const doSave = () => {
        if (id) {
            doUpdate();
        } else {
            doInsert();
        }

    }
    const doUpdate = () => {
        axios.put('http://127.0.0.1:8000/api/clients/' + id, {
            nombre: nombre,
            apellido: apellido,
            username: username,
            password: password,
            email: email,
            propietario: propietario
        }).then((response) => {
            console.log(response);
            navigate('/');
        }).catch((error) => {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message);
                toast.error(error.response.data.message);
            }
        });
    }
    const doInsert = () => {
        axios.post('http://127.0.0.1:8000/api/clients', {
            nombre: nombre,
            apellido: apellido,
            username: username,
            password: password,
            email: email,
            propietario: propietario
        }).then((response) => {
            console.log(response);
            navigate('/');
        }).catch((error) => {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                console.log(error.response.data.message);
                toast.error(error.response.data.message);
            }
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
                                    <h3>Formulario de Clients</h3>
                                </CardTitle>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <div>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl required type="text" value={nombre}
                                                     onChange={(e) => {
                                                         setNombre(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escribe un nombre
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Apellido</FormLabel>

                                        <FormControl required type="text" value={apellido}
                                                     onChange={(e) => {
                                                         setApellido(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escribe un apellido
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Username</FormLabel>

                                        <FormControl required type="text" value={username}
                                                     onChange={(e) => {
                                                         setUsername(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba un username
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Password</FormLabel>

                                        <FormControl required type="password" value={password}
                                                     onChange={(e) => {
                                                         setPassword(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba una Contrasena
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Email</FormLabel>

                                        <FormControl required type="email" value={email}
                                                     onChange={(e) => {
                                                         setEmail(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba un email
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Propietario</FormLabel>
                                        <Form.Check
                                            type="checkbox"
                                            checked={propietario}
                                            onChange={(e) => {
                                                setPropietario(e.target.checked);
                                            }}
                                            isInvalid={!propietario}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Elija si es propietario o no
                                        </Form.Control.Feedback>
                                    </div>

                                    <Alert className="mt-3" variant="info">
                                        El nombre es: {nombre}<br />
                                        el apellido es: {apellido}<br />
                                        el username es: {username}<br />
                                        el email es: {email}<br />
                                        Es propietario: {propietario ? 'sí' : 'no'}<br />
                                    </Alert>
                                    <div>
                                        <Button variant="primary" type="submit">Guardar</Button>
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

export default ClientRegister;