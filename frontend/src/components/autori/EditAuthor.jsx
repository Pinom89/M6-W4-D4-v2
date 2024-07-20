import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, InputGroup } from 'react-bootstrap';
import fetchWithAuth from '../../services/fetchWithAuth';


function EditAuthor({autori, setAutori, autore}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


// Stato per gestire l'utente in fase di modifica dell'autore
const [modificaAutore, setModificaAutore] = useState({nome:autore.nome, cognome:autore.cognome, email:autore.email, datadinascita:autore.datadinascita || null, avatar:autore.avatar});

  const modAutore = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchWithAuth(`${API_URL}/authors/${autore._id}`, {
      method: "PATCH",
      headers: {
      "Content-Type": "application/json",
      },
    });
      setAutori(autori.map((autore) => (autore._id === data._id ? modificaAutore : autore)));
      
     

    } catch (error) {
      console.log("Errore nell'aggiornamento", error);
    }
    finally {
      setTimeout(() => {
        handleClose();
      },1200)
     
    }
  };

  const handledate =() => {
    handleShow();
  }


  return (
    <>
      <Button 
       variant="warning"
       size='md'
       onClick={handledate}>
        Inizia modifica
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={modAutore} >

            <InputGroup className="mb-3 mt-5">
            <Form.Control
                placeholder="Nome"
                aria-label="Nome"
                aria-describedby="basic-addon1"
                type='text' 
                required
                value={modificaAutore.nome}
                onChange={(e) => setModificaAutore({...modificaAutore, nome: e.target.value})}
            />
            </InputGroup>

            <InputGroup className="mb-3">
                <Form.Control
                placeholder="Cognome"
                aria-label="Cognome"
                aria-describedby="basic-addon2"
                type='text'
                required
                value={modificaAutore.cognome}
                onChange={(e) => setModificaAutore({...modificaAutore, cognome: e.target.value})}
            />
            </InputGroup>

            <InputGroup className="mb-3">
            <Form.Control
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon2"
                type='email'
                required
                value={modificaAutore.email}
                onChange={(e) => setModificaAutore({...modificaAutore, email: e.target.value})}
            />
            </InputGroup>

            <InputGroup className="mb-3">
            <Form.Control
                placeholder="Data di nascita"
                aria-label="Date"
                aria-describedby="basic-addon2"
                type='date'
                required
                value={modificaAutore.datadinascita}
                onChange={(e) => setModificaAutore({...modificaAutore, datadinascita: e.target.value})}
            />
            </InputGroup>

            <InputGroup className="mb-3">
            <Form.Control
                placeholder="Link Avatar"
                aria-label="text"
                aria-describedby="basic-addon2"
                type='text'
                required
                value={modificaAutore.avatar}
                onChange={(e) => setModificaAutore({...modificaAutore, avatar: e.target.value})}
            />
            </InputGroup>
           
            <Modal.Footer>
                <Button 
                    size="md"
                    variant="dark"
                    type="submit" 
                    className='ms-3' >
                    Salva Modifica
                 </Button>
                <Button
                    variant="outline-dark"
                    onClick={handleClose}
                    className='mx-1'
                    size='md'>
                    Annulla
                </Button>
         
        </Modal.Footer>
    </Form>
        </Modal.Body>
      
      </Modal>
    </>
  );
}

export default EditAuthor;