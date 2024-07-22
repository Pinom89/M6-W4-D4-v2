import React, {useContext} from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";
import { ThemeContext } from "../../components/AuthContext";

const Home = props => {

  const [tema, setTema] = useContext(ThemeContext);


  const [search, setSearch] = useState("");
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
    <h1 className="blog-main-title mb-5 text-center fluo-text flicker-in-2">Benvenuto sullo Strive Blog!</h1>
    <Container fluid="sm" bg={tema} data-bs-theme={tema}>
      
      <BlogList search={search} handleInputChange={handleInputChange} />
    </Container>
    </>
  );
};

export default Home;
