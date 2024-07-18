import React from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = props => {
  const [search, setSearch] = useState("");
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <>
    <h1 className="blog-main-title mb-5 text-center fluo-text flicker-in-2">Benvenuto sullo Strive Blog!</h1>
    <Container fluid="sm">
      
      <BlogList search={search} handleInputChange={handleInputChange} />
    </Container>
    </>
  );
};

export default Home;
