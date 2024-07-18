// Importo i pacchetti necessari
import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js'; // Importa le rotte
import blogRoutes from './routes/blogRouter.js';
import cors from 'cors';
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler
} from './middleware/errorHandlers.js';
import path from 'path'; // UPLOAD: Modulo per gestire i percorsi dei file
import { fileURLToPath } from 'url'; // UPLOAD Per convertire URL in percorsi di file
import authRoutes from './routes/authRoutes.js';
import session  from 'express-session';
import passport from "./config/passportConfig.js";


// UPLOAD: Configurazione per utilizzare __dirname in moduli ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




// Carica le variabili d'ambiente
dotenv.config();

// Inizializza l'app Express
const app = express();

// abilitato server per collegamento front-end
app.use(cors());

// Middleware per il parsing del corpo delle richieste JSON
app.use(express.json());

// Configurazione della sessione per autenticazione Google
app.use(
  session({
      // Il 'secret' è usato per firmare il cookie di sessione
    // È importante che sia una stringa lunga, unica e segreta
    secret: process.env.SESSION_SECRET, 
     // 'resave: false' dice al gestore delle sessioni di non
    // salvare la sessione se non è stata modificata
    resave: false,
     // 'saveUninitialized: false' dice al gestore delle sessioni di non
    // creare una sessione finché non memorizziamo qualcosa
    // Aiuta a implementare le "login sessions" e riduce l'uso del server di memorizzazione
    saveUninitialized: false,
  })
)
// NEW! Inizializzazione di Passport
app.use(passport.initialize());
app.use(passport.session());

// ** Fine configurazione Google**

// Connessione a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connesso'))
  .catch((err) => console.error('MongoDB: errore di connessione.', err));

// Definizione della porta su cui il server ascolterà
const PORT = process.env.PORT || 5000;



// Usa le rotte per gli utenti
app.use('/auth', authRoutes);
app.use('/authors', userRoutes);
app.use('/blogs', blogRoutes);
app.use(badRequestHandler);
app.use(unauthorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);


// Avvio del server
app.listen(PORT, () => {
  console.log(`Server acceso sulla porta ${PORT}`);
  console.log("Sono disponibili i seguenti endpoints:");
  console.table(endpoints(app));
});

