import {Alert, Badge, Card, CardBody, CardTitle, Col, Container, Row, Table} from "react-bootstrap";
import Menu from "../../components/Menu";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getTipoForDisplay} from "../../utilities/PremiseUtilities.js";

const ReservationsList = () => {
    const navigate = useNavigate();
    const [reservationList, setReservationList] = useState([]);
    const {id} = useParams();


    useEffect(() => {
        if (!id) {
            return;
        }
        fetchListaReservations(id);
    }, [id])

    const fetchListaReservations = (id) => {
        axios.get('http://127.0.0.1:8000/api/premises/owner/reservations/'+ id, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setReservationList(response.data)
            }).catch((error) => {
            console.log(error);
        });
    }

    const onDeleteClick = (id) => {
        const confirm = window.confirm('¿Está seguro de eliminar el registro?');
        if (!confirm) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/reservations/' + id, {
            headers: {
                'Authorization': ` ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                fetchListaReservations(localStorage.getItem('client_id'));
            }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                navigate('/clients/login');
            }
        });
    }

    return (<>
        <Menu/>
        <Container>
            <Row className="mt-3 mb-3">
                <Col>
                    <Card>
                        <CardBody>
                            <CardTitle>
                                <h3>Lista de las Reservas del alojamiento</h3>
                            </CardTitle>
                            <Table hover>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {reservationList && reservationList.map(item =>
                                    <Card key={"card" + item.id} className="m-5 d-flex align-items-center">
                                        <CardBody>
                                            <tr key={"tr" + item.id}>
                                                <td className="d-flex align-items-center">
                                                    <Card.Img variant="top"
                                                              src={"http://localhost:8000/uploads/reservations/" + item.id + ".jpg"}/>
                                                </td>
                                                <Card className="m-3">
                                                    <td className="d-flex align-items-center">
                                                        <Alert bg="primary" className="m-2 text-center">
                                                            Tu reserva para:

                                                            <h1>{item.premise.titulo}</h1>

                                                        </Alert>
                                                    </td>
                                                    <td className="d-flex">
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Descripcion:
                                                        </Badge>
                                                        <Card.Text>
                                                            {item.premise.descripcion}
                                                        </Card.Text>
                                                    </td>
                                                    <td className="d-flex">
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Cantidad de Habitaciones:
                                                            <h1>{item.premise.cantidad_habitaciones}</h1>
                                                        </Badge> <br/>
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Cantidad de Baños:
                                                            <h1>{item.premise.cantidad_banos}</h1>
                                                        </Badge> <br/>
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Capacidad de Personas:
                                                            <h1>{item.premise.max_personas}</h1>
                                                        </Badge>
                                                    </td>
                                                    <td className="d-flex">{item.premise.tiene_wifi ?
                                                        <Alert variant="success">Tiene Wifi</Alert> :
                                                        <Alert variant="danger">No tiene Wifi</Alert>}</td>
                                                    <td className="d-flex">
                                                        <Alert variant="success">
                                                            {getTipoForDisplay(item.premise.tipo_propiedad)}
                                                        </Alert>
                                                    </td>
                                                </Card>
                                                <Card className="m-3">
                                                    <td>
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Ubicado en la ciudad:
                                                            <h1>
                                                                {item.premise.ubicacion_ciudad}
                                                            </h1>
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Fecha de Entrada:
                                                            <h1>
                                                                {new Date(item.fecha_inicio).toLocaleDateString()}
                                                            </h1>
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Fecha de Salida:
                                                            <h1>
                                                                {new Date(item.fecha_final).toLocaleDateString()}
                                                            </h1>
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary"
                                                               className="m-2 text-center d-flex align-items-center">
                                                            Precio:
                                                            <h1>
                                                                {item.costo_total}
                                                            </h1>
                                                        </Badge>
                                                    </td>
                                                    <td className="d-flex">
                                                        <button className="btn btn-danger w-100" onClick={() => {
                                                            onDeleteClick(item.id)
                                                        }}>
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </Card>
                                            </tr>

                                        </CardBody>
                                    </Card>
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

export default ReservationsList;