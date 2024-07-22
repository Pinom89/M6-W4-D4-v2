import {useContext} from "react";
import { Card , Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import BlogAuthor from "../blog-author/BlogAuthor";
import "./styles.css";
import fetchWithAuth from "../../../services/fetchWithAuth";
import { AuthContext } from "../../AuthContext";



const BlogItem = ({ title, cover, _id, author, blogs, setBlogs }) => {
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
   // console.log(author);

 // tramite il context mi porto gli stati del login cois da utilizzarli nel componente
  const { authorLogin  } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);

// funzione per cancellare il blog
  const cancellaBlog = async (id) => {
    try {
      await fetchWithAuth(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
      });

      setBlogs(blogs.filter((blog) => blog._id !== id));
      alert("Blog eliminato");
    } catch (err) {
      console.log("Errore nella cancellazione", err);
      alert("Errore durante l'eliminazione del blog"); // Opzionale: notifica l'utente dell'errore
    }
  };
  // console.log(author.email);

  return (
    <Card className="blog-card shadow-drop-tl">
      <Link to={`/blog/${_id}`} className="blog-link">
        <Card.Img variant="top" src={cover} className="blog-cover scale-up-ver-center blog-immage" />
      </Link>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
      </Card.Body>
      <Card.Footer>
        <BlogAuthor email={author.email}  />
      </Card.Footer>
      {/* i pulsanti saranno visibili solo se l'utente è loggato e la mail corrisponde all'email dell'autore del blog */}
      {isLoggedIn && authorLogin && authorLogin.email === author.email && ( 
      <div className="d-flex justify-content-end gap-3 align-items-center p-3">
        <Button as={Link} variant="dark" to={`/edit/${_id}`} className='mx-1'>Inizia Modifica</Button>
        <Button variant="outline-danger" onClick={() => cancellaBlog(_id)} className='mx-1'>Cancella</Button>
      </div>
      )}
    </Card>
  );
};


export default BlogItem;