import { Button, Card, CardBody, CardTitle, Col, Container, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import Menu from "../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ProfilePicture = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [foto, setFoto] = useState(null);

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
        const formParams = new FormData();
        formParams.append('image', foto);
        axios.post('http://127.0.0.1:8000/api/premises/' + id + '/profile/', formParams,
            {
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response) => {
                console.log(response);
                navigate('/premises/list');
            }
            ).catch((error) => {
                console.log(error);
            }
            );
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
                                    <h3>Foto de Alojamiento</h3>
                                </CardTitle>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <div>
                                        <FormControl required type="file"
                                            onChange={(e) => {
                                                setFoto(e.target.files[0]);
                                            }} />
                                        <Form.Control.Feedback type="invalid">
                                            Seleccione una imagen
                                        </Form.Control.Feedback>
                                    </div>

                                    <div>
                                        <Button variant="primary" type="submit">Guardar</Button>
                                        <Button variant="link">Volver</Button>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ProfilePicture;