import React from 'react'
import { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth';  // importo fetch per creare un token

export default function Register() {
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.URL || "http://localhost:5000";
  // dichiaro link standard
 const AUTHORS= "/authors";

 // dichiaro usestate per campi input tranne file
 const [register, setRegister] = useState({
  nome: "",
  cognome: "",
  email: "",
  datadinascita: "",
  password: "",
  avatar:""
 })

 const [notadult, setNotAdult] = useState(false)

    // creo funzione per verificare data di nascita maggiore uguale a 18 anni
    const isAdult = (birthDate) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age >= 18;
    };

// dichiaro funzione che prende i valori di input per creare un autore e verica data di nascita 
const handleRegisterInputChange = (e) => {
  const {name, value} = e.target;
  
  if (name === 'datadinascita') {
    if (isAdult(value)) {
      setRegister(prev => ({
        ...prev,
        [name]: value
      }))
      setNotAdult(false);
    } else {
      setNotAdult(true)
     
      e.target.value = '';
    }
  } else {
    setRegister(prev => ({
      ...prev,
      [name]: value
    }));
  }
};

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Dati inviati:', register);  // Stampo la variabile di stato
    alert("Sono pronto a postare i dati"); 

    try {
      const result = await fetchWithAuth(`${API_URL}/${AUTHORS}` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(register),
      });
      alert("sciamaninnnnnnn");
      console.log('Risultato:', result);
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
    }
    finally {
      setRegister({
        nome: "",
        cognome: "",
        email: "",
        datadinascita: "",
        password: "",
        avatar:""
      })
      navigate('/login');
    }
  };


  return (
  
<Container>
        <Row>
            <Col >
    <h2 className='mt-3'>Registra il tuo utente</h2>
    <Form onSubmit={handleRegisterSubmit}>

    <InputGroup className="mb-3 mt-5">
      <Form.Control
        placeholder="Nome"
        name="nome"
        aria-label="Nome"
        aria-describedby="basic-addon1"
        type='text' 
        required
        value={register.nome}
        onChange={handleRegisterInputChange}
      />
    </InputGroup>

    <InputGroup className="mb-3">
        <Form.Control
        placeholder="Cognome"
        name="cognome"
        aria-label="Cognome"
        aria-describedby="basic-addon2"
        type='text'
        required
        value={register.cognome}
        onChange={handleRegisterInputChange}
      />
    </InputGroup>

    <InputGroup className="mb-3">
       <Form.Control
        placeholder="Email"
        name="email"
        aria-label="Email"
        aria-describedby="basic-addon2"
        type='email'
        required
        value={register.email}
        onChange={handleRegisterInputChange}
      />
    </InputGroup>

    <InputGroup className="mb-3">
       <Form.Control
        placeholder="Data di nascita"
        name="datadinascita"
        aria-label="Date"
        max={new Date().toISOString().split('T')[0]}  // Imposto la data massima di inserimento a oggi
        aria-describedby="basic-addon2"
        type='date'
        required
        value={register.datadinascita}
        onChange={handleRegisterInputChange}
      />
      {notadult && <p>Devi avere almeno 18 anni per registrarti</p>}

    </InputGroup>

      <InputGroup className="mb-3">
       <Form.Control
        placeholder="Avatar"
        aria-label="text"
        aria-describedby="basic-addon2"
        type='text'
        name="avatar"
        value={register.avatar}
        onChange={handleRegisterInputChange}
      />
      </InputGroup>
      <InputGroup className="mb-3">
       <Form.Control
            placeholder="Password"
            name="password"
            aria-label="password"
            aria-describedby="basic-addon2"
            type='password'
            required
            onChange={handleRegisterInputChange}
          />
      </InputGroup>
      <Button 
          variant="dark" 
          type="submit"  >
                Crea Nuovo Autore
        </Button>
        <Button 
            variant="outline-dark" 
            onClick={ () => setRegister({
            nome: "",
            cognome: "",
            email: "",
            datadinascita: "",
            password: "",
            avatar:""})}
             >
            Reset
        </Button>
      </Form>
      </Col>
      </Row>
</Container>    


  )
}
