import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Image, Button } from 'react-bootstrap';
import './logged.css';
import {AuthContext} from "../AuthContext";


export default function Logged() {

  const { authorLogin, setAuthorLogin } = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const API_URL = (import.meta.env && import.meta.env.URL) || "http://localhost:5000";
  const navigate = useNavigate();


    useEffect(() => {
        // Controlla se esiste un token nel localStorage
        const checkLoginStatus = async () => {
          const token = localStorage.getItem('token');
          if (token) {
            try {
              await
              setIsLoggedIn(true);
            } catch (error) {
              console.error('Token non valido:', error);
              localStorage.removeItem('token');
              setIsLoggedIn(false);
            }
          } else {
            setIsLoggedIn(false);
          }
          setIsLoggedIn(!!token);
          // console.log(isLoggedIn);
        };
    
        // Controlla lo stato di login all'avvio
        checkLoginStatus();

    
        // Aggiungi un event listener per controllare lo stato di login
        window.addEventListener('storage', checkLoginStatus);
        // NEW! Evento per il cambio di stato
        window.addEventListener("loginStateChange", checkLoginStatus);
       
       

    
        // Rimuovi l'event listener quando il componente viene smontato
        return () => {
          window.removeEventListener("storage", checkLoginStatus);
          window.removeEventListener("loginStateChange", checkLoginStatus);
        };
      }, [ isLoggedIn, setIsLoggedIn,navigate ]);

      const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('storage'));
      };
      

      useEffect(() => {
       
        const fetchAuthor = async () => {
          try {
            const userData = await fetchWithAuth(`${API_URL}/auth/me`);
            setAuthorLogin(userData);
          //  console.log(userData);
      
          } catch (error) {
            console.error('Errore nel recupero dei dati utente:', error);
            navigate('/login');
          }}
           
          if (isLoggedIn) {
            fetchAuthor();
          }
          }, [ setAuthorLogin, isLoggedIn, setIsLoggedIn, navigate ]);

  return (
    <div className='d-column justify-content-center align-items-center  mb-2'>
      <h5  style={{color:'white'}}>
      {isLoggedIn ? `Benvenuto ${authorLogin.nome}` : ''}
    

     
    </h5>
      <div className='d-flex justify-content-center align-items-center gap-3'>
          {isLoggedIn ? (<Image src={authorLogin.avatar} roundedCircle className='imgprofile' />) : (<Image src="https://media.istockphoto.com/id/1622583937/it/foto/connessioni-di-intelligenza-artificiale-in-testa-cyborg-dimezzata-in-cemento.webp?b=1&s=170667a&w=0&k=20&c=mn9UtEL95V4id1h0KfoNiRDbns6KeefrLSZndUDg4IA=" roundedCircle className='imgprofile' />) }
      
        <Button 
        variant= {isLoggedIn ? 'outline-danger' : 'outline-secondary'}
        onClick={() => isLoggedIn ? handleLogout() : navigate('/login')}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </div>
    </div>
  )
}