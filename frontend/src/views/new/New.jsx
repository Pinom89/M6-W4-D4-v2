import React, {  useState, useContext } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthContext.js";
import fetchWithAuth from '../../services/fetchWithAuth';
const NewBlogPost = () => {

  const { authorLogin} = useContext(AuthContext);
  const { isLoggedIn} = useContext(AuthContext);
 console.log(authorLogin.email);
 console.log(isLoggedIn);
const navigate = useNavigate();

const [coverFile, setCoverFile] = useState(null);
const [error, setError] = useState(false);

  const [newblog, setNewblog] = useState({
    readTime: { value: 1, unit: 'minuti' },
    category: '',
    title: '',
    cover: '',
    author: authorLogin.email,
    content: ''
  });

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const creaBlog = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Aggiungi i campi del blog al FormData
    formData.append('readTime[value]', newblog.readTime.value);
    formData.append('readTime[unit]', newblog.readTime.unit);
    formData.append('category', newblog.category);
    formData.append('title', newblog.title);
    formData.append('author[email]', authorLogin.email);
    formData.append('content', newblog.content);
    
    // Verifico che il titolo sia minimo di 15 caratteri altrimenti esco dalla funzione
    if (newblog.title.length < 15) {
        return setError(true);
    }

    // Aggiungi il file di copertina se presente
    if (coverFile) {
        formData.append('cover', coverFile);
    }

    try {
        const response = await fetchWithAuth("http://localhost:5000/blogs", {
            method: "POST",
         
            
            body: formData, // Usa formData invece di JSON.stringify(newblog)
        });
        setNewblog(response);
        alert("Blog creato con successo");
        setNewblog({
            readTime: { value: '', unit: '' },
            category: '',
            title: '',
            author: { email: '' },
            content: ''
        });
        setCoverFile(null); // Resetta anche il file di copertina
        setTimeout(() => {
            navigate("/");
        }, 2000);
    } catch (err) {
        console.log("Errore nella creazione", err);
    } finally {
      setTimeout(() => {
        navigate("/");
    }, 2000);
  }

};


  return (
    <Container className="new-blog-container">
      <Row>
        <Col md={2}>

        </Col>

      <Col md={8}>
      <Form className="mt-5" onSubmit={creaBlog}>
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Tempo di lettura </Form.Label>
          <Form.Control 
            size="lg"
            type="number" 
            min="0"
            placeholder="Inserisci tempo di lettura in numeri"
            required
            className="mb-4"
            value={newblog.readTime.value}
            onChange={(e) => setNewblog({
              ...newblog,
              readTime: { ...newblog.readTime, value: parseInt(e.target.value) }
            })}
          />
          <Form.Control 
            size="lg"
            type="string"
            placeholder="Inserisci tempo di lettura  Es: secondi, minuti, ore"
            required
            className="mt-4"
            value={newblog.readTime.unit}
            onChange={(e) => setNewblog({
              ...newblog,
              readTime: { ...newblog.readTime, unit: e.target.value }
            })}
          />
        </Form.Group>
        
        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control 
            size="lg" 
            type="string" 
            placeholder="Inserisci categoria"
            required
            value={newblog.category}
            onChange={(e) => setNewblog({...newblog, category: e.target.value})}
          />
        </Form.Group>

        <Form.Group controlId="blog-form" className= "mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control 
            className={` ${error ? "error-title": ""}`}
            size="lg"  
            type="string"
            placeholder='Inserisci titolo'
            required
            value={newblog.title}
            onChange={(e) => {
              setError(false) // porta error in false e quindi il <p> del rigo 142 viene nascosto
              setNewblog({...newblog, title: e.target.value})}
            }

          />
        </Form.Group>
         {/* paragrafo che mostra errore commesso dall'utente nell'inserimento della lunghezza del titolo */}
        <p  className="explane-title" style={{display: error ? "block" : "none"}}>Inserisci minimo 15 caratteri</p>

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Cover</Form.Label>
          <Form.Control 
            size="lg" 
            name="cover"
            type="file" 
            placeholder="Inserisci link della cover" 
            required
            onChange={handleFileChange}
          />
        </Form.Group>

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            size="lg"
            type="email"
            readOnly
            placeholder={authorLogin.email}
            required 
            // value={newblog.author.email}
            // onChange={(e) => setNewblog({...newblog,
            //   author: {...newblog.author, email: e.target.value}})}
          />
        </Form.Group>
       
        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Form.Control 
            as="textarea"
            style={{ height: "200px" }}
            size="lg"
            type="text"
            placeholder="Inserisci testo del blog"
            required 
            value={newblog.content}
            onChange={(e) => setNewblog({...newblog, content: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button onClick={ () => setNewblog({
           
              readTime: { value: 1, unit: 'minuti' },
              category: '',
              title: '',
              cover: '',
              author: { email: '' },
              content: ''
          })}

            type="reset" 
            size="lg"
            variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
       </Form>
       </Col>
       <Col md={2}>
         
       </Col>
      </Row>
    </Container>
  );
};

export default NewBlogPost;