import React, { useContext } from "react";
import { Button, Container, Navbar, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo1 from "../../assets/logo1.png";
import "./styles.css";
import Logged from "../../components/logged/Logged";
import { AuthContext } from "../../components/AuthContext";
import { FaRegMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { ThemeContext } from "../../components/AuthContext";

const NavBar = () => {
  const { authorLogin, isLoggedIn } = useContext(AuthContext);
  const [tema, setTema] = useContext(ThemeContext);

  return (
    <Navbar expand="lg" className="blog-navbar">
      <Container>
        <Row className="w-100">
          <Col xs={12} md={3} className="mb-3 mb-md-0">
            <Navbar.Brand as={Link} to="/" className="d-flex justify-content-center justify-content-md-start">
              <img className="blog-navbar-brand" alt="logo" src={logo1} />
            </Navbar.Brand>
          </Col>
          <Col xs={12} md={9}>
            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end align-items-center">
              <div className="d-flex mb-3 mb-md-0">
                <Button as={Link} to="/authors" className="blog-navbar-add-button bg-dark me-2" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                  </svg>
                  Vai agli Autori
                </Button>
                <Button as={Link} to="/author/register" className="blog-navbar-add-button bg-dark me-2" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                  </svg>
                  Registrati 
                </Button>
              </div>
              {isLoggedIn && authorLogin && (
                <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark mb-3 mb-md-0 mx-md-2" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
                  </svg>
                  Nuovo Articolo
                </Button>
              )}
              <div className="d-flex align-items-center">
                <Logged />
                <Button className="ms-2" variant="outline-light" onClick={() => tema === 'light' ? setTema('dark') : setTema('light')}>
                  {tema === 'light' ? <FaRegMoon /> : <IoSunnyOutline />}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default NavBar;