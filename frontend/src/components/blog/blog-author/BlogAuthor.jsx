import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";

const BlogAuthor = ({ email }) => {
 //  console.log("Email prop:", email);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [matchedUser, setMatchedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // funzione per richiamare elenco autori tramite get
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch(`${API_URL}/authors?limit=100`);
        const data = await response.json();
        // console.log("Fetched data:", data.users); // Verifica la struttura dei dati
        const user = data.users.find((user) => user.email === email) || {};
        setMatchedUser(user);
       // console.log("Matched user:", user);
       // console.log(matchedUser);
        setIsLoading(false);
      } catch (error) {
        console.error("Errore nella richiesta", error);
        setIsLoading(false);
      }
    };

    fetchAuthorData();
    // aggiungo dipendenza al cambiamento di Api_url e email
  }, [API_URL, email]);

  // imposto caricamento  se i dati non sono ancora pronti
  if (isLoading) {
    return <div>Caricamento...</div>;
  }
 // immagine di dafault se matchedUser non ha immagine
  const defaultAvatar = "https://media.istockphoto.com/id/1164769247/it/foto/notifica-sui-social-media-di-amici-o-follower.jpg?s=2048x2048&w=is&k=20&c=E3LyK8AAyh4vpD8OpCB_ABHAP-mwNHfR91prNaK4gUo=";

  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <div>
          <Image 
            src={matchedUser.avatar ? matchedUser.avatar : defaultAvatar} 
            alt={matchedUser.avatar ? 'User avatar' : 'Default avatar'}
            roundedCircle 
            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
          />
        </div>
      </Col>
      <Col>
        <div>di</div>
        <h6>{email}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;
