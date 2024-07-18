import React, { useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";

const BlogAuthor = ({email}) => {


  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await fetch('http://localhost:5000/authors?limit=100');
        const data = await response.json();
        setAvatar(data.authors || []); // Assicurati che sia sempre un array
        setIsLoading(false);
      } catch (error) {
        console.error("Errore nella richiesta", error);
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, []);

  if (isLoading) {
    return <div>Caricamento...</div>;
  }

  const matchedUser = avatar.find((user) => user.email === email) || {};

  console.log(matchedUser.email);
  console.log(matchedUser.avatar);
  
  const defaultAvatar = "https://media.istockphoto.com/id/1164769247/it/foto/notifica-sui-social-media-di-amici-o-follower.jpg?s=2048x2048&w=is&k=20&c=E3LyK8AAyh4vpD8OpCB_ABHAP-mwNHfR91prNaK4gUo=";

  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <div >
          <Image 
            
            src={matchedUser.avatar || defaultAvatar} 
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