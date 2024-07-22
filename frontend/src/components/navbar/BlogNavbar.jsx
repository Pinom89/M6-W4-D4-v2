import React, { useContext } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.png";
import "./styles.css";
import Logged from "../../components/logged/Logged";
import { AuthContext, ThemeContext } from "../../components/AuthContext";
import { IoSunnyOutline } from "react-icons/io5";
import { FaRegMoon } from "react-icons/fa";

const NavBar = () => {

  const [tema, setTema] = useContext(ThemeContext);
  const { authorLogin  } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Navbar expand="lg" className="blog-navbar" >
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo1} />
        </Navbar.Brand>
        <div className="d-flex align-items-center justify-content-center ">
          <div className="justify-content-center align-items-center d-md-flex">
            <Button as={Link} to="/authors" className="blog-navbar-add-button bg-dark" size="sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="currentColor"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
                
              >
                <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
              </svg>
              Vai agli Autori
            </Button>
            <Button as={Link} to="/author/register" className="blog-navbar-add-button bg-dark" size="sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="currentColor"
                  className="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                </svg>
                Registrati 
              </Button>
          

              {isLoggedIn && authorLogin && ( 
                <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark" size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="currentColor"
                    className="bi bi-plus-lg"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                  </svg>
                  Nuovo Articolo
                </Button>
              )}
              <Logged />  {/* inserisco componente carica Toker e visualizza dati dell'autore loggato o permette di effettuare logout */}
              <Button className="ms-2" variant="outline-dark" onClick={() =>{tema === 'light' ? setTema('dark') : setTema('light') }}>
                {tema === 'light' ? <FaRegMoon /> : <IoSunnyOutline />}
              </Button>
          </div>
       
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
