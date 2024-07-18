import React, { useState, useEffect } from 'react';
import { Form, InputGroup, Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

export default function Login() {
    const [login, setLogin] = useState({
        email: '',
        password: ''
    });
    
    const navigate = useNavigate();  // Inizializza il navigatore per cambiare pagina
    const location = useLocation(); //  Accedo ai parametri dell'URL corrente



    const API_URL = "http://localhost:5000";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLogin({
         ...login,
          [name]: value
        }
        );
    };
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(login),
            });
              
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Dettagli errore:', errorData);
                throw new Error(`Errore nel login: ${errorData.message || response.statusText}`);
              }
            
            const data = await response.json();
            localStorage.setItem('token', data.token);
                
            window.dispatchEvent(new Event('login'));
            alert('Login effettuato');
            setTimeout(() => {
                navigate('/'); 
                console.log('Dati di login inviati:', login);
            }, 1500);
                
        } catch (error) {
            console.error("Errore nella chiamata API di login:", error); 
            alert("Credenziali non valide. Riprova.");
        }
    };

    const handleReset = () => {
        setLogin({
            email: "",
            password: ""
        });
    };


// Funzione per autenticazione Gooogle
        useEffect(() => {
            // estraggo i parametri dallo URL corrente
            const params = new URLSearchParams(location.search);
            // Cerco parametro 'token' nell'URL corrente
            const token = params.get('token');

            // Se il token esiste, lo imposto nel localStorage
            if (token) {
                // Se troviamo un token, lo salviamo nel localStorage
                localStorage.setItem('token', token);
                // Dispacchamo un evento 'storage' per aggiornare gli altri componenti che potrebbero dipendere dal token
                window.dispatchEvent(new Event('login'));
                // Navighiamo alla home page
                navigate("/");
            }
        }, [location, navigate]); // Questo effect dipende da location e navigate

// Funzione per gestire il login con Google
const handleGoogleLogin = () => {
    // Reindirizziamo l'utente all'endpoint del backend che inizia il processo di autenticazione
    window.location.href = "http://localhost:5000/auth/google";
};  

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className='mt-3'>Accedi alla piattaforma</h2>
                    <Form onSubmit={handleLoginSubmit}>
                        <InputGroup className="mb-3 mt-5">
                            <Form.Control
                                placeholder="Email"
                                name="email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                type='text' 
                                
                                value={login.email}
                                onChange={handleInputChange}
                            />
                        </InputGroup>

                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Password"
                                name="password"
                                aria-label="Password"
                                aria-describedby="basic-addon2"
                                type='password'
                                
                                value={login.password}
                                onChange={handleInputChange}
                            />
                        </InputGroup>

                        <Button 
                            variant="dark" 
                            type="submit" 
                            className='me-2'
                        >
                            Accedi
                        </Button>
                        <Button
                            variant="outline-dark" 
                            onClick={handleReset}
                            type="button"
                        >
                            Resetta
                        </Button>   
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col className='mt-3'>
                    <Button
                        variant="light" 
                        onClick={handleGoogleLogin}
                        type="button"
                        size='md'
                    >
                     Login with  <FcGoogle style={{fontSize: '25px'}}/>        
                                        </Button>
                </Col>
            </Row>
            
        </Container>
    );
}
