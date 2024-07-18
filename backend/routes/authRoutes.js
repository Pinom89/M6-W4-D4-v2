import express from "express"; // Importa il pacchetto Express
import User from "../models/User.js"; // Importa il modello User
import { generateJWT } from "../utils/jwt.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router(); // Crea un router Express


 

// Rotta per autenticare un utente tramite Login
router.post("/login", async (req, res) => {
    try {
        // Cerca l'autore nel database usando l'email
        const { email, password} = req.body;
        // Cerca l'autore nel data base usando l'email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json("Autore non trovato");
        }
        // Verifica la password usando il metodo comparePassword definito nel modello User

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json("Password errata");
        }

        // Genera il token usando il metodo generateJWT definito nel modello User
        const token = await generateJWT({id: user._id});
        
        // Restituisce il token e messaggio di successo
        res.json({ token , message: "Autenticazione riuscita" });
    } catch (error) {
        console.error("Errore nel login:", error);
        res.status(500).json({ message: "Errore del server"});
    }
    });


    // GET /me => restituisce l'autore collegato al token di accesso
    // authMiddleware verifica il token e aggiunge i dati dell'autore a req.author
         router.get("/me", authMiddleware, (req, res) => {
             // Converte il documenti Moongoose in un oggetto JavaScript semplice
            const userData = req.user.toObject();

            // Rimuovi la password dal risultato
            delete userData.password;
            // Invia i dati dell'autore come Risposta
            res.json(userData);
         });
         


    // Rotte Google Login
         router.get(
            "/google",
            passport.authenticate("google", {
            scope: ["profile", "email"]
            })  
        ) 
            // Questo endpoint inizia il flusso di autenticazione OAuth con Google
            // 'google' si riferisce alla strategia GoogleStrategy configurata in passportConfig.js
            // scope: specifica le informazioni richiediamo a Google (profilo e email)
        // Rotta di callback per l'autenticazione Google

        router.get(
            "/google/callback",
        // Passport tenta di autenticare l'utente con le credenziali Google
        passport.authenticate("google", { failureRedirect: "/login" }),
         // Se l'autenticazione fallisce, l'utente viene reindirizzato alla pagina di login
         async (req, res) => {
             try {
              // req.user contiene i dati dell'utente forniti da Passport
              // Genero il token usando il metodo generateJWT
              // La funzione generateJWT riceve come argomento l'ID dell'utente 
              const token = await generateJWT({ id: req.user._id });

             // Reindirizza l'utente al frontend, passando il token come parametro URL
       // Il frontend può quindi salvare questo token e usarlo per le richieste autenticate
       res.redirect(`http://localhost:3000/login?token=${token}`);
        } catch (error) {
                // Se c'è un errore durante l'autenticazione, l'utente viene reindirizzato alla pagina di login
                console.error("Errore nella generazione del token:", error);
                // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
        res.redirect("/login?error=auth_failed");
        }
 }
        );

    
        

export default router