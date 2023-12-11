import {Button, Col, Container, Form, Nav, Navbar, NavDropdown, NavLink, Row} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Menu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [propietario, setPropietario] = useState(false);
    const [client_id, setClient_id] = useState(-1);
    const paginasSinSesion = ['/clients/login', '/clients/register', '/', '/premises/list'];
    const [busquedaAvanzada, setBusquedaAvanzada] = useState(false);

    const onCerrarSesionClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('propietario');
        localStorage.removeItem('client_id');
        navigate('/clients/login');
    }
    const [searchValues, setSearchValues] = useState({
        ciudad: '',
        fechaEntrada: '',
        fechaSalida: '',
        Adultos: 0,
        Niños: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        setUsername(localStorage.getItem('username'));

        const propietario = localStorage.getItem('propietario') === 'true';
        setPropietario(propietario);

        const client_id = parseInt(localStorage.getItem('client_id'));
        setClient_id(client_id);


        if (!token) {
            if (!paginasSinSesion.includes(window.location.pathname)) {
                navigate('clients/login');
            }
        } else {
            // fetchUserInfo();
        }
    }, [])
    const handleSimpleSearch = () => {
        navigate(`/premises/list?ciudad=${searchValues.ciudad}`);
    };

    const handleAdvancedSearch = () => {
        navigate(`/premises/list?ciudad=${searchValues.ciudad}&fechaEntrada=${searchValues.fechaEntrada}&fechaSalida=${searchValues.fechaSalida}&cantidadPersonas=${(parseInt(searchValues.Adultos) || 0) + (parseInt(searchValues.Niños) || 0)}`);
    };

    return <Navbar  bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="/">AirBNB'nt</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {!isLoggedIn &&
                        <NavDropdown title="Client" id="basic-nav-dropdown">
                            <Link to="/clients/login" className="dropdown-item">Login</Link>
                            <Link to="/clients/register" className="dropdown-item">Register</Link>
                        </NavDropdown>
                    }

                    <Link to={`/premises/list`} className="btn">Lista detallada de alojamientos</Link>

                    {propietario &&
                        <NavDropdown title="Owned Premises" id="basic-nav-dropdown">
                            <Link to={`/premises/owner/${client_id}`} className="dropdown-item">Lista de tus Alojamientos</Link>
                            <Link to={`/premises/owner/create`} className="dropdown-item">Registrar Alojamientos a tu nombre</Link>
                        </NavDropdown>
                    }

                    {username && <NavDropdown className="d-flex" title={username} id="basic-nav-dropdown">
                        <Link to={`/reservations/${client_id}`} className="dropdown-item">Lista de tus Reservas</Link>
                        <button className="dropdown-item text-start" onClick={onCerrarSesionClick}>Cerrar sesión</button>
                    </NavDropdown>}
                    <Form.Check
                        className={"m-2 text-center text-white"}
                        type="checkbox"
                        id="busquedaAvanzadaCheckbox"
                        label="Búsqueda Avanzada"
                        checked={busquedaAvanzada}
                        onChange={() => setBusquedaAvanzada(!busquedaAvanzada)}
                    />
                    {busquedaAvanzada ? (
                        <Form inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ciudad"
                                        className="mr-sm-2"
                                        value={searchValues.ciudad}
                                        onChange={(e) => setSearchValues({ ...searchValues, ciudad: e.target.value })}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de entrada"
                                        className="mr-sm-2"
                                        value={searchValues.fechaEntrada}
                                        onChange={(e) => setSearchValues({ ...searchValues, fechaEntrada: e.target.value })}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Control
                                        type="date"
                                        placeholder="Fecha de salida"
                                        className="mr-sm-2"
                                        value={searchValues.fechaSalida}
                                        onChange={(e) => setSearchValues({ ...searchValues, fechaSalida: e.target.value })}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Control
                                        type="number"
                                        placeholder="Adultos"
                                        className="mr-sm-2"
                                        value={searchValues.Adultos}
                                        onChange={(e) => setSearchValues({ ...searchValues, Adultos: e.target.value })}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Form.Control
                                        type="number"
                                        placeholder="Niños"
                                        className="mr-sm-2"
                                        value={searchValues.Niños}
                                        onChange={(e) => setSearchValues({ ...searchValues, Niños: e.target.value })}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit" onClick={handleAdvancedSearch}>
                                        Buscar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    ) : (
                        <Form inline>
                            <Row>
                                <Col xs="auto">
                                    <Form.Control
                                        type="text"
                                        placeholder="Ciudad"
                                        className="mr-sm-2"
                                        value={searchValues.ciudad}
                                        onChange={(e) => setSearchValues({ ...searchValues, ciudad: e.target.value })}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit" onClick={handleSimpleSearch}>
                                        Buscar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}

export default Menu;