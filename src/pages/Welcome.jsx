import Menu from "../components/Menu";
import {
    Alert,
    Card,
    CardBody,
    CardImg,
    CardTitle,
    Col,
    Container,
    Row
} from 'react-bootstrap';
import axios from "axios";
import { useState, useEffect } from "react";

const Welcome = () => {
    const [uniqueCities, setUniqueCities] = useState([]);
    const [premiseList, setPremiseList] = useState([]);


    useEffect(() => {
        fetchListaPremises();
    }, []);

    const fetchListaPremises = () => {
        axios.get('http://localhost:8000/api/premises/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                setPremiseList(response.data);
                extractUniqueCities(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const extractUniqueCities = (data) => {
        const cities = [...new Set(data.map(premise => premise.ubicacion_ciudad))];
        setUniqueCities(cities);
    };

    return (
        <div>
            <Menu />
            <Container className="align-items-center">
                <Row className="mt-5 p-5 align-items-center justify-content-center">
                    {uniqueCities.map((city) => (
                        <Col key={city} className="mt-5" md={{ span: 10, offset: 1 }}>
                            <Card>
                                <CardBody>
                                    <CardTitle>
                                        <h1>{city}</h1>
                                    </CardTitle>
                                    <Alert variant="info">
                                        ¡No te pierdas nuestras ofertas en {city}!
                                    </Alert>
                                    <Container>
                                        {premiseList
                                            .filter((premise) => premise.ubicacion_ciudad === city)
                                            .map((premise) => (
                                                <Card className="d-flex align-items-center m-5" key={premise.id}>
                                                    <CardImg className="mw-100 mh-100 w-50 h-50" variant="top" src={`http://localhost:8000/uploads/premises/${premise.id}.jpg`} />
                                                    <CardTitle>
                                                        <h1>{premise.titulo}</h1>
                                                    </CardTitle>
                                                    <CardBody>
                                                        {premise.descripcion}
                                                    </CardBody>
                                                </Card>
                                            ))}
                                    </Container>
                                </CardBody>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
};

export default Welcome;
