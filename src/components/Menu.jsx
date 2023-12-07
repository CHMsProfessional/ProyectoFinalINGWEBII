import {Container, Nav, Navbar, NavDropdown, NavLink} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

const Menu = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [propietario, setPropietario] = useState(false);
    const [client_id, setClient_id] = useState(-1);
    const paginasSinSesion = ['/clients/login', '/clients/register', '/', '/premises/list'];

    const onCerrarSesionClick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('propietario');
        localStorage.removeItem('client_id');
        navigate('/clients/login');
    }

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
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>;
}

export default Menu;