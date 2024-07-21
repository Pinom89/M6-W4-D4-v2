import React from 'react'
import { useState, useEffect, useContext } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import fetchWithAuth from '../../services/fetchWithAuth';
import { AuthContext } from "../../components/AuthContext.js";
export default function EditBlog() {

    const { authorLogin } = useContext(AuthContext);
   
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const { id } = useParams();
    const navigate = useNavigate();
   // const [editnewblog, setEditnewblog] = useState(null);
 const [coverFile, setCoverFile] = useState(null);
 const [dateblog, setDateblog] = useState({
    readTime: { value: '', unit: '' },
    category: '',
    title: '',
    cover: '',
    author: authorLogin.email || "",
    content: ''
 });

 const handleFileChange = (e) => {
  setCoverFile(e.target.files[0]);
};

 useEffect(() => {
  const fetchBlog = async () => {
      try {
          const data = await fetchWithAuth(`${API_URL}/blogs/${id}`);
          setDateblog(data);
      } catch (err) {
          console.log("Errore nella richiesta", err);
      }
  };
  fetchBlog();
}, [id, API_URL]);  // inserisco dipendenza sulla costante getAutori

      console.log(dateblog);
// funzione per resettare i campi

const resetForm = () => {
    setDateblog({
      readTime: { value: 1, unit: 'minuti' },
      category: '',
      title: '',
      cover: '',
      author: { email: '' },
      content: ''
    });
  };


// funzione per effettuare la PATCH 
const editBlogid = async (e) => {
  e.preventDefault();

  const formData = new FormData();
    
  // Aggiungi i campi del blog al FormData
  formData.append('readTime[value]', dateblog.readTime.value);
  formData.append('readTime[unit]', dateblog.readTime.unit);
  formData.append('category', dateblog.category);
  formData.append('title', dateblog.title);
  formData.append('author[email]', authorLogin.email);
  formData.append('content', dateblog.content);
  

  // Aggiungi il file di copertina se presente
  if (coverFile) {
      formData.append('cover', coverFile);
  }


  try {
      await fetchWithAuth(`${API_URL}/blogs/${id}`, {
          method: "PATCH",
          body: formData,
      });
      alert("Blog modificato con successo");
      setDateblog({
          readTime: { value: '', unit: '' },
          category: '',
          title: '',
          author: { email: '' },
          content: ''
      });
    
  } catch (err) {
      console.error("Errore nella modifica", err);
      // alert(`Errore nella modifica: ${err.message}`);
  } finally {
    setCoverFile(null); // Resetta anche il file di copertina
    setTimeout(() => {
        navigate("/");
    }, 2000);
  }
};

  
    
      return (
        <Container className="new-blog-container">
          <Form className="mt-5" onSubmit={editBlogid}>
    
          <Form.Group controlId="blog-category" className="mt-3">
              <Form.Label>Tempo di lettura </Form.Label>
              <Form.Control 
                size="lg"
                type="number" 
                placeholder="Inserisci tempo di lettura in numeri"
                required
                className="mb-4"
                value={dateblog.readTime.value}
                onChange={(e) => setDateblog({
                  ...dateblog,
                  readTime: { ...dateblog.readTime, value: parseInt(e.target.value)}
                })}
                />
              <Form.Control size="lg"
                 type="string"
                 placeholder="Inserisci tempo di lettura  Es: secondi, minuti, ore"
                 required
                 className="mt-4"
                 value={dateblog.readTime.unit}
                 onChange={(e) => setDateblog({
                  ...dateblog,
                  readTime: { ...dateblog.readTime, unit: e.target.value }
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
                  value={dateblog.category}
                  onChange={(e) => setDateblog({...dateblog, category: e.target.value})}
                  />
            </Form.Group>
    
            <Form.Group controlId="blog-form" className="mt-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control 
                size="lg"  
                type="string"
                placeholder="Title"
                required
                value={dateblog.title}
                onChange={(e) => setDateblog({...dateblog, title: e.target.value})}
                />
            </Form.Group>
    
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
                 placeholder={authorLogin.email}
                 readOnly
                //  required 
                 value={authorLogin.email}
                //  onChange={(e) => setDateblog({...dateblog,
                //    author: {...dateblog.author, email: e.target.value}})}
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
                 value={dateblog.content}
                 onChange={(e) => setDateblog({...dateblog, content: e.target.value})}
                 />
            </Form.Group>
    
            <Form.Group className="d-flex mt-3 justify-content-end">
              <Button type="button" onClick={resetForm} size="lg" variant="outline-dark">
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
        </Container>
  )
        
}
