import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Form,
    FormControl,
    FormLabel,
    Row, Toast,
} from "react-bootstrap";
import Menu from "../../components/Menu";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import {getTipoForDisplay} from "../../utilities/PremiseUtilities";

const PremiseDetails = () => {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const {id} = useParams();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [tipoPremise, setTipoPremise] = useState("");
    const [cantidad_habitaciones, setCantidad_habitaciones] = useState("");
    const [cantidad_banos, setCantidad_banos] = useState("");
    const [cantidad_camas, setCantidad_camas] = useState("");
    const [tiene_wifi, setTiene_wifi] = useState(false);
    const [capacidad, setCapacidad] = useState("");
    const [precioPerNight, setPrecioPerNight] = useState(0);
    const [ciudad, setCiudad] = useState("");
    const [tarifa_limpieza, setTarifa_limpieza] = useState(0);
    const [tarifa_airbnbnt, setTarifa_airbnbnt] = useState(20);
    const [tarjeta_credito, setTarjeta_credito] = useState(0);
    const [nombre_titular_tarjeta, setNombre_titular_tarjeta] = useState("");
    const [fecha_vencimiento_tarjeta, setFecha_vencimiento_tarjeta] = useState("");
    const [codigo_seguridad_tarjeta, setCodigo_seguridad_tarjeta] = useState("");

    const [cantidad_noches, setCantidad_noches] = useState(0);
    const [fecha_inicio, setFecha_inicio] = useState("");
    const [fecha_final, setFecha_final] = useState("");
    const [costo_total, setCosto_total] = useState(0);

    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    useEffect(() => {
        if (!id) {
            return;
        }
        fetchPremise();
        calcularCostoTotal()
    }, [id,fecha_inicio, fecha_final, precioPerNight, tarifa_limpieza, tarifa_airbnbnt])

    const onFormSubmit = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        const isValid = form.checkValidity();
        setValidated(true);

        if (!isValid) {
            return;
        }
        calcularCostoTotal();
        doInsert();
    }
    const doInsert = () => {

        axios.post('http://127.0.0.1:8000/api/reservations', {
            premises_id: id,
            client_id: localStorage.getItem('client_id'),
            cantidad_noches: cantidad_noches,
            fecha_inicio: fecha_inicio,
            fecha_final: fecha_final,
            tarjeta_credito: tarjeta_credito,
            nombre_titular_tarjeta: nombre_titular_tarjeta,
            fecha_vencimiento_tarjeta: fecha_vencimiento_tarjeta,
            codigo_seguridad_tarjeta: codigo_seguridad_tarjeta,
            tarifa_airbnb: tarifa_airbnbnt,
            costo_total: costo_total
        }, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setErrorMessage("Reserva realizada con éxito");
            setShowErrorToast(true);
            navigate('/');
        }).catch((error) => {
            console.log(error);
            if(error.response.status === 401){
                setErrorMessage("No se pudo realizar la reserva, por favor inicia sesión");
                setShowErrorToast(true);
                navigate('/clients/login');
            }
        });
    }

    const fetchPremise = () => {
        axios.get('http://127.0.0.1:8000/api/premises/' + id, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setTitulo(response.data.titulo);
                setDescripcion(response.data.descripcion);
                setTipoPremise(response.data.tipo_propiedad);
                setCantidad_camas(response.data.cantidad_camas);
                setTiene_wifi(response.data.tiene_wifi)
                setCantidad_habitaciones(response.data.cantidad_habitaciones);
                setCantidad_banos(response.data.cantidad_banos);
                setCapacidad(response.data.max_personas);
                setPrecioPerNight(response.data.precio_por_noche);
                setCiudad(response.data.ubicacion_ciudad);
                setTarifa_limpieza(response.data.tarifa_limpieza);
            }).catch((error) => {
            console.log(error);
        });
    }

    function calcularCostoTotal() {
        let fechaInicio = new Date(fecha_inicio);
        let fechaFinal = new Date(fecha_final);

        let today = new Date();
        today.setDate(today.getDate() + 3);

        if (fechaInicio < today) {
            setErrorMessage("La fecha de inicio debe ser al menos 3 días en el futuro");
            setShowErrorToast(true);
            return;
        }

        if (fechaFinal <= fechaInicio) {
            setErrorMessage("La fecha final debe ser después de la fecha de inicio");
            setShowErrorToast(true);
            return;
        }

        let diff = fechaFinal.getTime() - fechaInicio.getTime();
        let diffDays = diff / (1000 * 3600 * 24);

        setCantidad_noches(diffDays);
        setCosto_total(parseInt(diffDays * precioPerNight) + parseInt(tarifa_limpieza) + parseInt(tarifa_airbnbnt));
    }

    const renderToast = (message) => (
        <Toast className="m-2 text-white" bg="danger" show={showErrorToast} onClose={() => setShowErrorToast(false)} animation={true} delay={5000} autohide>
            <Toast.Header>
                <strong className="me-auto">Error</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
        </Toast>
    );

    return (
        <>

            <Menu/>


            <Container>
                <Row className="mt-3 mb-3 flex-row">
                    <Col md={6} >
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <h1>
                                        <Badge bg="secondary">{titulo}</Badge>
                                    </h1>
                                </CardTitle>
                                <Card>
                                    <Card.Img variant="top" src={`http://localhost:8000/uploads/premises/${id}.jpg`}/>
                                    <Card.Body>
                                        <Card.Title>Descripcion</Card.Title>
                                        <Card.Text>
                                            {descripcion}
                                        </Card.Text>
                                        <Card.Title>Tipo de Propiedad</Card.Title>
                                        <Card.Text>
                                            {getTipoForDisplay(tipoPremise)}
                                        </Card.Text>
                                        <Card.Title>Cantidad de Habitaciones</Card.Title>
                                        <Card.Text>
                                            {cantidad_habitaciones}
                                        </Card.Text>
                                        <Card.Title>Cantidad de Baños</Card.Title>
                                        <Card.Text>
                                            {cantidad_banos}
                                        </Card.Text>
                                        <Card.Title>Cantidad de Camas</Card.Title>
                                        <Card.Text>
                                            {cantidad_camas}
                                        </Card.Text>
                                        <Card.Title>Tiene Wifi</Card.Title>
                                        <Card.Text>
                                            {tiene_wifi ? "Si" : "No"}
                                        </Card.Text>
                                        <Card.Title>Capacidad</Card.Title>
                                        <Card.Text>
                                            {capacidad}
                                        </Card.Text>
                                        <Card.Title>Precio por noche</Card.Title>
                                        <Card.Text>
                                            {precioPerNight}
                                        </Card.Text>
                                        <Card.Title>Ciudad</Card.Title>
                                        <Card.Text>
                                            {ciudad}
                                        </Card.Text>
                                        <Card.Title>Tarifa de limpieza</Card.Title>
                                        <Card.Text>
                                            {tarifa_limpieza}
                                        </Card.Text>
                                        <Card.Title>Tarifa de AirBNB'nt</Card.Title>
                                        <Card.Text>
                                            {tarifa_airbnbnt}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <Card className="flex-column p-5 m-0 vw-100">
                            <CardBody>
                                <CardTitle>
                                    <h3>Formulario de Reserva</h3>
                                </CardTitle>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <div>
                                        <FormLabel>Fecha de Inicio</FormLabel>
                                        <FormControl required type="date" value={fecha_inicio}
                                                     onChange={(e) => {
                                                         setFecha_inicio(e.target.value);
                                                     }}/>
                                        <Form.Control.Feedback type="invalid">
                                            Elije una Fecha de Inicio
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Fecha Final</FormLabel>
                                        <FormControl required type="date" value={fecha_final}
                                                     onChange={(e) => {
                                                         setFecha_final(e.target.value);
                                                     }}/>
                                        <Form.Control.Feedback type="invalid">
                                            Elije una Fecha Final
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Tarjeta de Crédito</FormLabel>
                                        <FormControl required type="number" value={tarjeta_credito}
                                                        onChange={(e) => {
                                                            setTarjeta_credito(e.target.value);
                                                        }}/>
                                        <Form.Control.Feedback type="invalid">
                                            Ingresa una Tarjeta de Crédito
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Nombre del Titular de la Tarjeta</FormLabel>
                                        <FormControl required type="text" value={nombre_titular_tarjeta}
                                                        onChange={(e) => {
                                                            setNombre_titular_tarjeta(e.target.value);
                                                        }}/>
                                        <Form.Control.Feedback type="invalid">
                                            Ingresa el Nombre del Titular de la Tarjeta
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Fecha de Vencimiento de la Tarjeta</FormLabel>
                                        <FormControl required type="date" value={fecha_vencimiento_tarjeta}
                                                        onChange={(e) => {
                                                            setFecha_vencimiento_tarjeta(e.target.value);
                                                        }}/>
                                        <Form.Control.Feedback type="invalid">
                                            Ingresa la Fecha de Vencimiento de la Tarjeta
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Código de Seguridad de la Tarjeta</FormLabel>
                                        <FormControl required type="number" value={codigo_seguridad_tarjeta}
                                                        onChange={(e) => {
                                                            setCodigo_seguridad_tarjeta(e.target.value);
                                                        }
                                                        }/>
                                        <Form.Control.Feedback type="invalid">
                                            Ingresa el Código de Seguridad de la Tarjeta
                                        </Form.Control.Feedback>
                                    </div>

                                    {renderToast(errorMessage)}
                                    <Alert className="mt-3" variant="info">
                                        El costo total es de: {costo_total} <br/>
                                        la Cantidad de Noches es de: {cantidad_noches}
                                    </Alert>
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


export default PremiseDetails;

