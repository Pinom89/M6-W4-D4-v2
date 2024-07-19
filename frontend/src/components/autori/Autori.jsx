import {useEffect, useState, useContext} from 'react'
import { Card, Container, Row, Col, Button, Form } from 'react-bootstrap';
import "./autori.css"
import fetchWithAuth from '../../services/fetchWithAuth';
import EditAuthor from './EditAuthor';
import { AuthContext } from "../../components/AuthContext.js";
import formatDate from '../../services/formatDate.js';



 export default function Autori() {
  const API_URL = import.meta.env.URL || "http://localhost:5000";
  const { authorLogin  } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1); // Pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Numero totale di pagine
  const [limit, setLimit] = useState(10); // Numero di utenti per pagina
  


    // Stato per memorizzare la lista degli autori
    const [autori, setAutori] = useState([]);
    // Stato per gestire i dati del nuovo autore da creare
    
    useEffect(() => {
    const fetchAutori = async () => {
      try {
        const data = await fetchWithAuth(`${API_URL}/authors?page=${currentPage}&limit=${limit}`);
        setAutori(data.users);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log("Errore nella richiesta", error);
      }};
      
    // Funzione per creare nuovo autore
   
      fetchAutori();
      } , [currentPage, limit]);
    // Funzione per creare nuovo autore
   
        
  const cancellaAutore = async (id) => {
    try {
        await fetchWithAuth(`${API_URL}/authors/${id}`, {
            method: "DELETE",
        });
        setAutori(autori.filter((autore) => autore._id !== id));
    } catch (error) {
        console.log("Errore nella cancellazione", error);
    }
}
  //funzione per la modifica di un autore
 

  return (
    <>
    <Container>
  
      <h2 className='p-2 mb-5 mt-4 text-center'>Lista Autori</h2>
    <Row xs={1} sm={2} md={3} lg={4} className='g-4'>
      {autori.map((autore) => (
        <Col key={autore._id}>
          <Card  className='author-card shadow-drop-left'>
            <Card.Img className='author-cover' variant="top" src={autore.avatar} alt={autore.nome + " " + autore.cognome} />
            <Card.Body>
              <Card.Title>{autore.nome} {autore.cognome}</Card.Title>
              <Card.Text> data di nascita: { formatDate(autore.datadinascita, "it" )}</Card.Text>
              <Card.Text className='pb-4 mb-3 overflow-auto'>Email: {autore.email}</Card.Text>
                <div className='btn-author'>
                {authorLogin &&isLoggedIn && authorLogin.email === autore.email && (
                    <>
                    {/*dentro EditAuthor è  presente la funzione di mlodifica autore nel modal*/}
                    <EditAuthor setAutori={setAutori} autori={autori} autore={autore}/>
                    <Button variant="danger" onClick={() => cancellaAutore(autore._id)} size='sm' className='mx-1'>Cancella</Button>
                    </>
                  )}
                </div>
            </Card.Body>           
          </Card>
        </Col>
      ))}
    </Row>
       {/* PAGINAZIONE */}
       <Row className='mt-5'>
      <div className='d-flex justify-content-center align-items-center'>
          {/* Pulsante per andare alla pagina precedente */}
          <Button
            onClick={() =>
              setCurrentPage((currentPage) => Math.max(currentPage - 1, 1))
            }
            // Disabilita il pulsante se siamo già sulla prima pagina
            disabled={currentPage === 1}
            variant='dark'
          >
            Precedente
          </Button>
  
          {/* Mostra il numero della pagina corrente e il totale delle pagine */}
          <span className='mx-2'>
            Pagina <strong>{currentPage}</strong> di <strong>{totalPages}</strong>
          </span>
  
          {/* Pulsante per andare alla pagina successiva */}
          <Button
            onClick={() =>
              setCurrentPage((currentPage) =>
                Math.min(currentPage + 1, totalPages),
              )
            }
            // Disabilita il pulsante se siamo sull'ultima pagina
            disabled={currentPage === totalPages}
            variant='dark'
          >
            Successiva
          </Button>
  
          {/* Selezione per cambiare il numero di elementi per pagina */}
          <Form.Select
            
            className='ms-3 w-25'
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))} // perchè da select ottengo stringhe!
          >
            <option value={4}>4 per pagina</option>
            <option value={8}>8 per pagina</option>
            <option value={20}>20 per pagina</option>
          </Form.Select>
        </div>
     </Row>
  

    </Container>
  </>

  );
};


