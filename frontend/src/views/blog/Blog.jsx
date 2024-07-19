import React, { useEffect, useState, useContext } from "react";
import { Container, Image, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";
import Spinner from 'react-bootstrap/Spinner';
import CreateComment from "./CreateComment";
import EditComment from "./EditComment";
import fetchWithAuth from "../../services/fetchWithAuth";
import { AuthContext } from "../../components/AuthContext.js"
import { Link } from "react-router-dom";
import formatDate from "../../services/formatDate.js";

const Blog = () => {  
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();
  // stato del modale per creazione commento
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  // stato del commento per modifica commento
  const handleEditShow = (comm) => {
    setEditComment(comm);
    setEditShow(true);
  };
  const handleEditClose = () => setEditShow(false);
  const [editShow, setEditShow] = useState(false);

  const { authorLogin } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);
 // stato del modale

 const API_URL = (import.meta.env && import.meta.env.URL) || "http://localhost:5000";
  

// stato del commento
  const [comment, setComment] = useState([{name: "", email: "", comment: ""}]);
// stato del nuovo commento
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    comment: ""});

    const [editComment, setEditComment] = useState({name: "", email: "", comment: ""});

    useEffect(() => {
      const fetchBlog = async () => {
        const { id } = params;
        try {
          const data = await fetchWithAuth(`${API_URL}/blogs/${id}`);
          
          if (!data) {
            navigate("*");
            return;
          }
          setBlog(data);
        } catch (error) {
          console.log("Errore nella richiesta", error);
          navigate("*"); // Reindirizza anche in caso di errore
        } finally {
          setLoading(false);
        }
      };
    
      fetchBlog();
    }, [navigate, params, comment]);  // Dipendenze mantenute
  

  useEffect(() => {
    if (blog.comments) {
      setComment(blog.comments);
     }
  },[blog.comments]);
  

  // creo una funzione che permette di salvare i valori presenti nell'input per creare un commento
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment({
      ...newComment,
     [name]: value
  })
  console.log(newComment)
  };


  // creo funzione che salva i campi di input per modificare i commenti
  const handleEditInputChange = (e) => {
    const {name, value} = e.target;
    setEditComment({
      ...editComment,
      [name]: value
    })
  }

  // cancellazione commenti
  const deleteComment = async (id) => {
    try {
      await fetchWithAuth(`${API_URL}/blogs/${blog._id}/comments/${id}`, {
            method: "DELETE",
        });
        setComment(comment.filter((comment) => comment._id !== id));
        alert("Commento eliminato");
    } catch (error) {
        console.log("Errore nella cancellazione", error);
        alert("Si è verificato un errore durante l'eliminazione del commento");
    }
}
// modifica commento

const updateComment = async (e) => {
  e.preventDefault();
  try {
      const data = await fetchWithAuth(`${API_URL}blogs/${blog._id}/comments/${editComment._id}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(editComment),
      });
      setComment(comment.map((commento) => commento._id === data.id ? data : commento));
      setEditComment({name: "", email: "", comment: ""});
      alert("Commento modificato");
      handleEditClose();
  } catch (error) {
      console.log("Errore nell'aggiornamento del commento", error);
      alert("Si è verificato un errore durante l'aggiornamento del commento");
  }
}






// creazione commenti

const createComment = async (e) => {
  e.preventDefault();
  try {
      const data = await fetchWithAuth(`${API_URL}/blogs/${blog._id}/comments`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
      });

      setComment([...comment, data]);
      setNewComment({name: "", email: "", comment: ""}); // Resetta il form
  } catch (error) {
      console.log("Errore nella creazione", error);
  } finally {
      setTimeout(() => {
          handleClose();
      }, 500);
  }
}


 



  if (loading) {
    return <div className="text-center mt-5" > <Spinner animation="border" size="lg"/></div>;  // Aggiunto un ritorno durante il caricamento
  }
    
  return (
    <div className="blog-details-root">
      <Container>
        <Image className="blog-details-cover " src={blog.cover} fluid />
        <h1 className="blog-details-title">{blog.title}</h1>

        <div className="blog-details-container">
          <div className="blog-details-author">
            <BlogAuthor {...blog.author} />
          </div>
          <div className="blog-details-info">
            <div> {formatDate(blog.createdAt, "it") }</div>
            <div>{`lettura da ${blog.readTime?.value} ${blog.readTime?.unit}`}</div>
            <div
              style={{
                marginTop: 20,
              }}
            >
              <BlogLike defaultLikes={["123"]} onChange={console.log} />
            </div>
          </div>
        </div>

        <div
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        ></div>

        <Row>
          
        
            <ListGroup className="mt-5">
              {comment.map((comm) => (
                <ListGroup.Item action variant="light"  key={comm._id}>
                  <div className="d-flex justify-content-between align-items-center">
                  <Col sm={1} md={2} className="align-items-start"> {comm.createdAt && !isNaN(new Date(comm.createdAt).getTime()) 
                    ? formatDate(comm.createdAt, "it"): "Data non valida"}
                  </Col>
                  <Col sm={6} md={6}>  {comm.comment} </Col>
                  <Col sm={1} md={2}> <span className="fw-bold">{comm.name}</span> </Col>
                  <Col sm={1} md={2}>
                  <div className="d-flex-md justify-content-md-center align-items-sm-center flex-column-sm flex-wrap-sm gap-2  ">
                  {isLoggedIn && authorLogin && authorLogin.email === comm.email && ( 
                    <>
                    <Button variant="dark-outline" className="mt-sm-2 mt-xs-2 mt-lg-0 ms-lg-2" size="sm" onClick={() => handleEditShow(comm)}>Modifica</Button>
                    <Button variant="dark" className="mt-sm-2 mt-xs-2 mt-lg-0 ms-lg-2" size="sm" onClick={() => deleteComment(comm._id)}>Elimina</Button>
                    </>
                  )}
                    </div>
                  </Col>
                  </div>
                </ListGroup.Item>
                  ))
                }

            </ListGroup>
        </Row>
        <Row>
        <Col md={4}>
        {isLoggedIn ? ( 
              <Button className="mt-3" variant="dark" onClick={handleShow}>Crea commento</Button>
            ):
            (
              <div>
            <p>Per creare un commento devi essere loggato</p>
            <Button className="link-register" as={Link} to="/author/register">
                Registrati
            </Button> 
             </div> )}
            <CreateComment 
              handleClose={handleClose} 
              setNewComment={setNewComment} 
              setShow={setShow} show={show}
              handleShow={handleShow}
              createComment={createComment}
              newComment={newComment}
              handleInputChange={handleInputChange}
            />

          </Col>
        <Col md={4}>     
            {/* modale modifica commento  */}        
           {/* <EditComment editShow={editShow} handleEditClose={handleEditClose}  updateComment={updateComment} handleClose={handleClose} editComment={editComment} handleEditInputChange={handleEditInputChange} setEditComment={setEditComment}  /> */}
              <EditComment 
                editShow={editShow} 
                handleEditClose={handleEditClose}  
                updateComment={updateComment} 
                handleClose={handleClose} 
                editComment={editComment} 
                handleEditInputChange={handleEditInputChange} 
                setEditComment={setEditComment}  
              />
       </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blog;