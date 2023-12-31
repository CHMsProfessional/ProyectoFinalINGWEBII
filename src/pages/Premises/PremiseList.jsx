import {Button, Card, CardBody, CardTitle, Col, Container, Form, Row, Table} from "react-bootstrap";
import Menu from "../../components/Menu";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {getTipoForDisplay} from "../../utilities/PremiseUtilities";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const PremiseList = ({google}) => {
    const navigate = useNavigate();

    const [premiseList, setPremiseList] = useState([]);
    const sortedPremiseList = [...premiseList].sort((a, b) => b.precio_por_noche - a.precio_por_noche);

    const [filteredPremiseList, setFilteredPremiseList] = useState([]);
    const sortedFilteredPremiseList = [...filteredPremiseList].sort((a, b) => b.precio_por_noche - a.precio_por_noche);


    const [showInfoWindow, setShowInfoWindow] = useState(false);
    const [activeMarker, setActiveMarker] = useState(null);
    const [filterCantidadHabitaciones, setFilterCantidadHabitaciones] = useState(0);
    const [filterCantidadCamas, setFilterCantidadCamas] = useState(0);
    const [filterCantidadBanos, setFilterCantidadBanos] = useState(0);
    const [filterCantidadPersonas, setFilterCantidadPersonas] = useState(0);
    const [filterWifi, setFilterWifi] = useState(false);
    const [filterTipoPropiedad, setFilterTipoPropiedad] = useState('');
    const [filterPrecioPorNocheMax, setFilterPrecioPorNocheMax] = useState(0);
    const [filterPrecioPorNocheMin, setFilterPrecioPorNocheMin] = useState(0);
    const [filterCiudad, setFilterCiudad] = useState('');
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [uniqueCities, setUniqueCities] = useState([]);
    const [selectedPremise, setSelectedPremise] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: -17.783482, lng: -63.181837 });

    const searchParams = new URLSearchParams(location.search);
    const urlFilterCantidadPersonas = parseInt(searchParams.get("cantidadPersonas")) || 0;
    const urlFilterCiudad = searchParams.get("ciudad") || '';
    const urlFechaEntrada = searchParams.get("fechaEntrada") || '';
    const urlFechaSalida = searchParams.get("fechaSalida") || '';
    const onMarkerClick = (props, marker, e) => {
        console.log('onMarkerClick');
        setActiveMarker(marker);
        setShowInfoWindow(true);
        setSelectedPremise(props);
        setMapCenter({ lat: props.position.lat, lng: props.position.lng });
    }

    const onInfoWindowClose = () => {
        console.log('onInfoWindowClose');
    }

    useEffect(() => {
        fetchListaPremises();
        if (urlFilterCantidadPersonas > 0) {
            setFilterCantidadPersonas(urlFilterCantidadPersonas);
            applyFilters()
        }
        if (urlFilterCiudad !== '') {
            setFilterCiudad(urlFilterCiudad);
            applyFilters()
        }
    }, [filterCantidadHabitaciones, filterCantidadCamas, filterCantidadBanos, filterCantidadPersonas, filterWifi, filterTipoPropiedad, filterPrecioPorNocheMax, filterCiudad]);

    const fetchListaPremises = () => {
        axios.get('http://localhost:8000/api/premises/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setPremiseList(response.data);
                extractUniqueCities(response.data);
            }).catch((error) => {
            console.log(error);
        });
    }

    const extractUniqueCities = (data) => {
        const cities = [...new Set(data.map(premise => premise.ubicacion_ciudad))];
        setUniqueCities(cities);
    }


    const applyFilters = () => {
        const filteredPremises = premiseList.filter((premise) => {
            if (filterCantidadHabitaciones > 0 && premise.cantidad_habitaciones !== filterCantidadHabitaciones) {
                return false;
            }
            if (filterCantidadCamas > 0 && premise.cantidad_camas < filterCantidadCamas) {
                return false;
            }

            if (filterCantidadBanos > 0 && premise.cantidad_banos < filterCantidadBanos) {
                return false;
            }

            if (filterCantidadPersonas > 0 && premise.cantidad_personas < filterCantidadPersonas) {
                return false;
            }

            if (filterWifi && !premise.tiene_wifi) {
                return false;
            }
            if (filterTipoPropiedad !== '' && premise.tipo_propiedad !== filterTipoPropiedad) {
                return false;
            }
            if (
                (filterPrecioPorNocheMin > 0 && premise.precio_por_noche < filterPrecioPorNocheMin) ||
                (filterPrecioPorNocheMax > 0 && premise.precio_por_noche > filterPrecioPorNocheMax)
            ) {
                return false;
            }
            return !(filterCiudad !== '' && premise.ubicacion_ciudad !== filterCiudad);

        });
        setFilteredPremiseList(filteredPremises);
        setIsFilterApplied(true);
    };

    const initialFilters = {
        cantidadHabitaciones: 0,
        cantidadCamas: 0,
        cantidadBanos: 0,
        cantidadPersonas: 0,
        wifi: false,
        tipoPropiedad: '',
        precioPorNoche: 0,
        ciudad: '',
    };

    const [filters, setFilters] = useState({...initialFilters});

    const clearFilters = () => {
        setFilters({...initialFilters});
        setFilteredPremiseList([]);
        setIsFilterApplied(false);
    };

    function onSelectClick(id) {
        navigate(`/premises/${id}`)
    }

    return (
        <>
            <Menu/>
            <Card>
                <CardBody>
                    <CardTitle>
                        <h3>Filtros</h3>
                    </CardTitle>
                    {/* Filtros */}
                    <Form>
                        <Form.Group controlId="filterCiudad">
                            <Form.Label>Ciudad:</Form.Label>
                            <Form.Control as="select" onChange={(e) => setFilterCiudad(e.target.value)}>
                                <option value="">Seleccione</option>
                                {uniqueCities.map((city, index) => (
                                    <option key={index} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="filterPrecioPorNocheMax">
                            <Form.Label>Precio por Noche MAX:</Form.Label>
                            <Form.Control type="number"
                                          onChange={(e) => setFilterPrecioPorNocheMax(parseInt(e.target.value))}/>
                        </Form.Group>

                        <Form.Group controlId="filterPrecioPorNocheMin">
                            <Form.Label>Precio por Noche MIN:</Form.Label>
                            <Form.Control type="number"
                                            onChange={(e) => setFilterPrecioPorNocheMin(parseInt(e.target.value))}/>
                        </Form.Group>

                        <Form.Group controlId="filterCantidadPersonas">
                            <Form.Label>Cantidad de Personas:</Form.Label>
                            <Form.Control type="number"
                                            onChange={(e) => setFilterCantidadPersonas(parseInt(e.target.value))}/>
                        </Form.Group>

                        <Form.Group controlId="filterCantidadBanos">
                            <Form.Label>Cantidad de Baños:</Form.Label>
                            <Form.Control type="number"
                                            onChange={(e) => setFilterCantidadBanos(parseInt(e.target.value))}/>
                        </Form.Group>


                        <Form.Group controlId="filterTipoPropiedad">
                            <Form.Label>Tipo de Propiedad:</Form.Label>
                            <Form.Control as="select" onChange={(e) => setFilterTipoPropiedad(e.target.value)}>
                                <option value="">Seleccione</option>
                                <option value="0">Casa</option>
                                <option value="1">Departamento</option>
                                <option value="2">Cabaña</option>
                                <option value="3">Loft</option>
                                <option value="4">Hostal</option>
                                <option value="5">Hotel</option>
                                <option value="6">Otro</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="filterCantidadHabitaciones">
                            <Form.Label>Cantidad de Habitaciones:</Form.Label>
                            <Form.Control type="number"
                                          onChange={(e) => setFilterCantidadHabitaciones(parseInt(e.target.value))}/>
                        </Form.Group>

                        <Form.Group controlId="filterCantidadCamas">
                            <Form.Label>Cantidad de Camas:</Form.Label>
                            <Form.Control type="number"
                                            onChange={(e) => setFilterCantidadCamas(parseInt(e.target.value))}/>
                        </Form.Group>


                        <Form.Group controlId="filterWifi" className="mb-3">
                            <Form.Check type="checkbox" label="Wifi" onChange={(e) => setFilterWifi(e.target.checked)}/>
                        </Form.Group>

                        <Button variant="primary" onClick={applyFilters}>
                            Aplicar Filtros
                        </Button>
                        <Button variant="secondary" className="ml-2" onClick={clearFilters}>
                            Limpiar Filtros
                        </Button>
                    </Form>
                </CardBody>
            </Card>
            <Container className="justify-content-evenly align-items-center">
                <Row style={{width: '1500px'}} className="justify-content-center align-items-center ">
                    <Col md={8}>
                        <Card>
                            <CardBody>
                                <CardTitle>
                                    <h3>Lista de Premises</h3>
                                </CardTitle>
                                <Table hover>
                                    <thead>
                                    <tr>
                                        <th></th>
                                        <th>Titulo</th>
                                        <th>Ciudad</th>
                                        <th>Tipo de Alojamiento</th>
                                        <th>Precio por noche</th>
                                        <th>Tiene Wifi?</th>
                                        <th>Cantidad de Camas</th>
                                        <th>Capacidad</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isFilterApplied ? (
                                        sortedFilteredPremiseList.map(item =>
                                            <tr key={"tr" + item.id}>
                                                <td>
                                                    <img style={{maxHeight: '100px'}}
                                                         src={"http://localhost:8000/uploads/premises/" + item.id + ".jpg"}/>
                                                </td>
                                                <td>{item.titulo}</td>
                                                <td className="d-flex">{item.ubicacion_ciudad}</td>
                                                <td>{getTipoForDisplay(item.tipo_propiedad)}</td>
                                                <td>{item.precio_por_noche}</td>
                                                <td>{item.tiene_wifi ? 'Si' : 'No'}</td>
                                                <td>{item.cantidad_camas}</td>
                                                <td>{item.max_personas}</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => {
                                                        onSelectClick(item.id);
                                                    }}>
                                                        Seleccionar Alojamiento
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        sortedPremiseList.map(item =>
                                            <tr key={"tr" + item.id}>
                                                <td>
                                                    <img style={{maxHeight: '100px'}}
                                                         src={"http://localhost:8000/uploads/premises/" + item.id + ".jpg"}/>
                                                </td>
                                                <td>{item.titulo}</td>
                                                <td className="d-flex">{item.ubicacion_ciudad}</td>
                                                <td>{getTipoForDisplay(item.tipo_propiedad)}</td>
                                                <td>{item.precio_por_noche}</td>
                                                <td>{item.tiene_wifi ? 'Si' : 'No'}</td>
                                                <td>{item.cantidad_camas}</td>
                                                <td>{item.max_personas}</td>
                                                <td>
                                                    <button className="btn btn-primary" onClick={() => {
                                                        onSelectClick(item.id);
                                                    }}>
                                                        Seleccionar Alojamiento
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <CardBody>
                                <div className='mapContainer'>
                                    <Map
                                        google={google}
                                        zoom={14}
                                        style={{width: '100%', height: '100%', position: 'relative'}}
                                        initialCenter={mapCenter}
                                        center={mapCenter}
                                    >
                                        {isFilterApplied ? (
                                            filteredPremiseList.map((premise, index) => {
                                                const {ubicacion_lat, ubicacion_long, titulo, id} = premise;
                                                return (
                                                    <Marker
                                                        key={index}
                                                        onClick={onMarkerClick}
                                                        position={{
                                                            lat: parseFloat(ubicacion_lat),
                                                            lng: parseFloat(ubicacion_long)
                                                        }}
                                                        name={titulo}
                                                        title={titulo}
                                                        id={id}
                                                    />
                                                );
                                            })
                                        ) : (
                                            premiseList.map((premise, index) => {
                                                const {ubicacion_lat, ubicacion_long, titulo, id} = premise;
                                                return (
                                                    <Marker
                                                        key={index}
                                                        onClick={onMarkerClick}
                                                        position={{
                                                            lat: parseFloat(ubicacion_lat),
                                                            lng: parseFloat(ubicacion_long)
                                                        }}
                                                        name={titulo}
                                                        title={titulo}
                                                        id={id}
                                                    />
                                                );
                                            })
                                        )}
                                        <InfoWindow onClose={onInfoWindowClose} marker={activeMarker} visible={showInfoWindow}>
                                            {selectedPremise && (
                                                <div>
                                                    <h1>{selectedPremise.title}</h1>
                                                    <div>
                                                        <img className='imgInfoWindow' src={"http://localhost:8000/uploads/premises/" + selectedPremise.id + ".jpg"} alt="Info Window" />
                                                    </div>
                                                    <div>
                                                        <a href={`/premises/${selectedPremise.id}`}>Seleccionar Alojamiento</a>
                                                    </div>
                                                </div>
                                            )}
                                        </InfoWindow>
                                    </Map>
                                </div>
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
})(PremiseList);
