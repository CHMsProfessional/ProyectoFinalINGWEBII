import {Alert, Card, CardBody, CardTitle, Col, Container, Row, Table} from "react-bootstrap";
import Menu from "../../components/Menu";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getTipoForDisplay} from "../../utilities/PremiseUtilities";
import moment from "moment/moment";
import {getListaPremises} from "../../services/PremiseService";

const PremiseOwnerList = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [premiseOwnerList, setPremiseOwnerList] = useState([]);
    useEffect(() => {
        if (!id) {
            return;
        }
        fetchListaPremises(id);
    }, [id])


    const fetchListaPremises = (id) => {
        getListaPremises(id).then((response) => {
            setPremiseOwnerList(response);
        }).catch((error) => {
            if (error.response.status === 401) {
                navigate('/clients/login');
            }
        });
    }

    const onEditClick = (id) => {
        navigate('/premises/owner/create/' + id);
    }
    const onReservesClick = (id) => {
        navigate('/premises/owner/evaluate/' + id);
    }
    const onDeleteClick = (id) => {
        const confirm = window.confirm('¿Está seguro de eliminar el registro?');
        if (!confirm) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/premises/' + id, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                fetchListaPremises(localStorage.getItem('client_id'));
            }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                navigate('/clients/login');
            }
        });
    }
    const onProfilePictureClick = (id) => {
        navigate('/premises/' + id + '/profile-picture');
    }
    return (<>
        <Menu/>
        <Container>
            <Row className="mt-3 mb-3">
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h3>Lista de Premises</h3>
                            </CardTitle>
                            <Table hover>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>id</th>
                                    <th>Titulo</th>
                                    <th>Descripcion</th>
                                    <th>Tipo</th>
                                    <th>Reservado</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {premiseOwnerList && premiseOwnerList.map(item =>
                                    <tr key={"tr" + item.id}>
                                        <td><img style={{maxHeight: '100px'}}
                                                 src={"http://localhost:8000/uploads/premises/" + item.id + ".jpg"}/>
                                        </td>
                                        <td>{item.id}</td>
                                        <td>{item.titulo}</td>
                                        <td>{item.descripcion}</td>
                                        <td>{getTipoForDisplay(item.tipo_propiedad)}</td>
                                        <td>
                                            {item.reservations.length > 0 ?
                                                <Alert variant="danger"> Si </Alert>
                                                :
                                                <Alert variant="success"> No </Alert>}
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => {
                                                onEditClick(item.id);
                                            }}>
                                                Editar
                                            </button>
                                        </td>
                                        {!item.reservations.length > 0  && <>
                                        <td>
                                            <button className="btn btn-danger" onClick={() => {
                                                onDeleteClick(item.id)
                                            }}>
                                                Eliminar
                                            </button>
                                        </td>
                                        </>}
                                        <td>
                                            <button className="btn btn-success" onClick={() => {
                                                onProfilePictureClick(item.id);
                                            }}>
                                                Foto de Alojamiento
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => {
                                                onReservesClick(item.id);
                                            }}>
                                                Ver Reservas del Alojamiento
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    </>);
}

export default PremiseOwnerList;