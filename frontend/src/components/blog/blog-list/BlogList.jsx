import {React, useState, useEffect} from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";
import Search from "../../search/Search";
import PlaceHolder from "../../placeholder/PlaceHolder";
import fetchWithAuth from '../../../services/fetchWithAuth';


const BlogList = ( {search, handleInputChange} ) => {
  const API_URL = import.meta.env.URL || "http://localhost:5000";
  const [currentPage, setCurrentPage] = useState(1); // Pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Numero totale di pagine
  const [limit, setLimit] = useState(10); // Numero di utenti per pagina
  
  
  const [loading , setLoading] = useState(true);

 // Stato per memorizzare la lista degli autori
 const [blogs, setBlogs] = useState([]);

 useEffect(() => {
  const fetchBlogs = async () => {
    
    try {
     const data = await fetchWithAuth(`${API_URL}/blogs?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`)
      setBlogs(data.blogPosts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.log("Errore nella richiesta", err);
    } finally {
      setTimeout(() => setLoading(false), 3000);
    }
  };
  fetchBlogs();
}, [currentPage, limit]); // La dipendenza getAutori non è stata aggiunta come richiesto


if (loading) 
  return (
    <Container>
      <Row>
        <Col md={4}>
          <PlaceHolder/>
        </Col>
        <Col md={4}>
          <PlaceHolder/>
        </Col>
        <Col md={4}>
          <PlaceHolder/>
        </Col>
      </Row>
    </Container>
  )


  return (
    <Container>
      <Row>
        <Col md={2}>
        </Col>
        <Col md={8}>
         <Search  search={search} handleInputChange={handleInputChange}/>
        </Col>
        <Col md={2}>
        </Col>
      </Row>
    <Row>
      {blogs.filter ((blog) => 
        blog.title.toLowerCase().includes(search.toLowerCase()))
      .map((blog) => 
        <Col
          key={blog._id}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem key={blog._id} title={blog.title} cover={blog.cover} author={blog.author} _id={blog._id} blogs={blogs} setBlogs={setBlogs} />
        </Col>
      )
    }
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
  );
};

export default BlogList;
