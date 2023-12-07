import { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, CardTitle, Col, Container, Form, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import Menu from "../../components/Menu";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import {getTipoForDisplay} from "../../utilities/PremiseUtilities.js";

const FormPremise = ({ google }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [validated, setValidated] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad_habitaciones, setCantidad_habitaciones] = useState(0);
    const [cantidad_camas, setCantidad_camas] = useState(0);
    const [cantidad_banos, setCantidad_banos] = useState(0);
    const [max_personas, setMax_personas] = useState(0);
    const [tiene_wifi, setTiene_wifi] = useState(false);
    const [tipo_propiedad, setTipo_propiedad] = useState("");
    const [precio_por_noche, setPrecio_por_noche] = useState(0);
    const [ubicacion_lat, setUbicacion_lat] = useState(0.0);
    const [ubicacion_long, setUbicacion_long] = useState(0.0);
    const [ubicacion_ciudad, setUbicacion_ciudad] = useState('');
    const [tarifa_limpieza, setTarifa_limpieza] = useState(0);

    const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });

    const onMapClick = (mapProps, map, clickEvent) => {
        const { latLng } = clickEvent;
        const lat = latLng.lat();
        const lng = latLng.lng();
        setUbicacion_lat(lat);
        setUbicacion_long(lng);
        setSelectedLocation({ lat, lng });
        console.log(lat, lng);
    };

    useEffect(() => {
        if (!id) {
            return;
        }
        fetchPremise();
    }, [id])
    const fetchPremise = () => {
        axios.get('http://127.0.0.1:8000/api/premises/' + id, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setTitulo(response.data.titulo);
                setDescripcion(response.data.descripcion);
                setCantidad_camas(response.data.cantidad_camas);
                setCantidad_habitaciones(response.data.cantidad_habitaciones);
                setCantidad_banos(response.data.cantidad_banos);
                setMax_personas(response.data.max_personas);
                setTiene_wifi(response.data.tiene_wifi);
                setTipo_propiedad(response.data.tipo_propiedad);
                setPrecio_por_noche(response.data.precio_por_noche);
                setUbicacion_lat(response.data.ubicacion_lat);
                setUbicacion_long(response.data.ubicacion_long);
                setUbicacion_ciudad(response.data.ubicacion_ciudad);
                setTarifa_limpieza(response.data.tarifa_limpieza);
            }).catch((error) => {
            console.log(error);
            if(error.response.status === 401){
                navigate('/login');
            }
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
        axios.put('http://127.0.0.1:8000/api/premises/' + id, {
            titulo: titulo,
            descripcion: descripcion,
            cantidad_camas: cantidad_camas,
            cantidad_habitaciones: cantidad_habitaciones,
            cantidad_banos: cantidad_banos,
            max_personas: max_personas,
            tiene_wifi: tiene_wifi,
            tipo_propiedad: tipo_propiedad,
            precio_por_noche: precio_por_noche,
            ubicacion_lat: ubicacion_lat,
            ubicacion_long: ubicacion_long,
            ubicacion_ciudad: ubicacion_ciudad,
            tarifa_limpieza: tarifa_limpieza
        }, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        }).then((response) => {
            console.log(response);
            navigate('/premises/owner/'+localStorage.getItem('client_id'));
        }).catch((error) => {
            console.log(error);
            if(error.response.status === 401){
                navigate('/clients/login');
            }
        });
    }
    const doInsert = () => {
        axios.post('http://127.0.0.1:8000/api/premises', {
            titulo: titulo,
            descripcion: descripcion,
            cantidad_habitaciones: cantidad_habitaciones,
            cantidad_banos: cantidad_banos,
            cantidad_camas: cantidad_camas,
            max_personas: max_personas,
            tiene_wifi: tiene_wifi,
            tipo_propiedad: tipo_propiedad,
            precio_por_noche: precio_por_noche,
            ubicacion_lat: ubicacion_lat,
            ubicacion_long: ubicacion_long,
            ubicacion_ciudad: ubicacion_ciudad,
            tarifa_limpieza: tarifa_limpieza,
            client_id: localStorage.getItem('client_id')
        }, {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        }).then((response) => {
            console.log(response);
            navigate('/premises/owner/'+localStorage.getItem('client_id'));
        }).catch((error) => {
            console.log(error);
            if(error.response.status === 401){
                navigate('/clients/login');
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
                                    <h3>Formulario de Premise</h3>
                                </CardTitle>
                                <Form noValidate validated={validated} onSubmit={onFormSubmit}>
                                    <div>
                                        <FormLabel>Titulo</FormLabel>
                                        <FormControl required type="text" value={titulo}
                                                     onChange={(e) => {
                                                         setTitulo(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba un Titulo para su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Descripcion</FormLabel>
                                        <FormControl required type="text" value={descripcion}
                                                     onChange={(e) => {
                                                         setDescripcion(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba una descripcion para su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Cantidad de Habitaciones</FormLabel>
                                        <FormControl required type="number" value={cantidad_habitaciones}
                                                     onChange={(e) => {
                                                         setCantidad_habitaciones(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba la cantidad de habitaciones de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Cantidad de Camas</FormLabel>
                                        <FormControl required type="number" value={cantidad_camas}
                                                     onChange={(e) => {
                                                         setCantidad_camas(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba la cantidad de camas de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Cantidad de Baños</FormLabel>
                                        <FormControl required type="number" value={cantidad_banos}
                                                     onChange={(e) => {
                                                         setCantidad_banos(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba la cantidad de baños de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Maximo de Personas</FormLabel>
                                        <FormControl required type="number" value={max_personas}
                                                     onChange={(e) => {
                                                         setMax_personas(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba la cantidad maxima de personas de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Tiene Wifi</FormLabel>
                                        <Form.Check
                                            type="checkbox"
                                            checked={tiene_wifi}
                                            onChange={(e) => {
                                                setTiene_wifi(e.target.checked);
                                            }}
                                            isInvalid={!tiene_wifi}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Elija si tiene wifi o no
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <Form.Label>Tipo de Propiedad:</Form.Label>
                                        <Form.Control as="select" onChange={(e) => setTipo_propiedad(e.target.value)}>
                                            <option value="">Seleccione</option>
                                            <option value="0">Casa</option>
                                            <option value="1">Departamento</option>
                                            <option value="2">Cabaña</option>
                                            <option value="3">Loft</option>
                                            <option value="4">Hostal</option>
                                            <option value="5">Hotel</option>
                                            <option value="6">Otro</option>
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            Escriba el tipo de propiedad de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Precio por Noche</FormLabel>
                                        <FormControl required type="number" value={precio_por_noche}
                                                     onChange={(e) => {
                                                         setPrecio_por_noche(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba el precio por noche de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div className="mapContainer mt-3" style={{ height: '300px', width: '100%' }}>
                                        <Map google={google} zoom={14}
                                             style={{ width: '100%', height: '100%', position: 'relative' }}
                                             initialCenter={{
                                                 lat: -17.783482,
                                                 lng: -63.181837
                                             }}
                                            center={selectedLocation}
                                            onClick={onMapClick}
                                        >
                                            <Marker
                                                position={selectedLocation}
                                            />
                                        </Map>
                                    </div>
                                    <div>
                                        <FormLabel>Ciudad</FormLabel>
                                        <FormControl required type="text" value={ubicacion_ciudad}
                                                     onChange={(e) => {
                                                         setUbicacion_ciudad(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba la ubicacion ciudad de su propiedad
                                        </Form.Control.Feedback>
                                    </div>
                                    <div>
                                        <FormLabel>Tarifa de Limpieza</FormLabel>
                                        <FormControl required type="number" value={tarifa_limpieza}
                                                     onChange={(e) => {
                                                         setTarifa_limpieza(e.target.value);
                                                     }} />
                                        <Form.Control.Feedback type="invalid">
                                            Escriba la tarifa de limpieza de su propiedad
                                        </Form.Control.Feedback>
                                    </div>

                                    <Alert className="mt-3" variant="info">
                                        El titulo es: {titulo}<br />
                                        la descripcion es: {descripcion}<br />
                                        la cantidad de habitaciones es: {cantidad_habitaciones}<br />
                                        la cantidad de baños es: {cantidad_banos}<br />
                                        el maximo de personas es: {max_personas}<br />
                                        tiene Wifi: {tiene_wifi ? 'sí' : 'no'}<br />
                                        el tipo de propiedad es: {getTipoForDisplay(tipo_propiedad)}<br />
                                        el precio por noche es: {precio_por_noche}<br />
                                        la ubicacion latitud es: {ubicacion_lat}<br />
                                        la ubicacion longitud es: {ubicacion_long}<br />
                                        la ubicacion ciudad es: {ubicacion_ciudad}<br />
                                        la tarifa de limpieza es: {tarifa_limpieza}<br />
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

const API_KEY = 'AIzaSyDFhD_mrzxhUac-SKi_1d4U7iv6P-GA1to';
export default GoogleApiWrapper({
    apiKey: API_KEY
})(FormPremise);