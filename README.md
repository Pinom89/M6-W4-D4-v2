# => Striveblogmazzilli MERN Full Stack

Un'applicazione web full stack per un blog, costruita utilizzando lo stack MERN (MongoDB, Express, React, Node.js).

# Link di accesso=> https://striveblogmazzilli.vercel.app/

## 🚀 Caratteristiche Principali

### 🏠 Homepage
- **Navbar**: 4 pulsanti principali (Vai agli autori, Registrati, Nuovo Articolo, Login/Logout)
- **Blog Post**: Visualizzazione dei post
- **Footer**: Informazioni sul sito

### 👤 Funzionalità per Utenti Loggati
- Modifica e cancellazione dei propri post
- Gestione dei commenti (creazione, modifica, cancellazione)
- Accesso alla sezione "Nuovo Articolo"

### 📝 Dettaglio Post
- Visualizzazione dei commenti per tutti
- Funzionalità di commento per utenti loggati

### 👥 Sezione Autori
- Elenco degli autori del blog
- Opzioni di modifica per l'autore loggato

### 🔐 Autenticazione
- Registrazione nuovo utente
- Login con credenziali o Google
- Logout

## 🧩 Componenti Principali

1. **Navbar**
   - Navigazione e profilo utente

    1. **Sezione Autori**
           - Gestione profili autori         
    
    2. **Form di Registrazione**
            - Creazione nuovo account

    4. **Form Nuovo Articolo**
            - Creazione post (utenti loggati)

    4. **Sistema di Autenticazione**
            - Login/logout e integrazione Google Auth  

        
2. **Blog Post**
   - Visualizzazione e gestione dei post
        1. **Dettaglio Post**
           - Visualizzazione completa e sistema commenti





## 🛠 Tecnologie Utilizzate

- **Frontend**: React.js
- **Backend**: Node.js, Express 
- **Database**: MongoDB
- **Autenticazione**: JWT, Google OAuth

## 📦 Installazione

```bash
# Clona il repository
git clone https://github.com/your-username/blog-mern-fullstack.git

# Entra nella directory del progetto
cd blog-mern-fullstack

# Installa le dipendenze per il backend
npm install

# Entra nella directory del frontend
cd client

# Installa le dipendenze per il frontend
npm install ( nella root frontend )


🚀 Avvio backend
- Dalla root backend, avvia il backend
node server.js

 # In un nuovo terminale, dalla directory 'client', avvia il frontend
npm start