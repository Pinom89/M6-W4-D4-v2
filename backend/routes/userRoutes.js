// routes/userRoutes.js

import express from "express"; // Importa il pacchetto Express
import User from "../models/User.js"; // Importa il modello User
import BlogPosts from "../models/BlogPosts.js";
import cloudinaryUploader from "../config/claudinaryConfig.js";
import { sendEmail } from "../services/emailservices.js";

const router = express.Router(); // Crea un router Express

// Rotta per ottenere tutti gli utenti
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Estrae il numero di pagina dalla query, default a 1 se non specificato
    const limit = parseInt(req.query.limit) || 6; // Estrae il limite di risultati per pagina, default a 10
    const sort = req.query.sort || "nome"; // Determina il campo per l'ordinamento, default a "name"
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // Determina la direzione dell'ordinamento (1 per ascendente, -1 per discendente)
    const skip = (page - 1) * limit; // Calcola quanti documenti saltare per arrivare alla pagina richiesta


    const users = await User.find({}) // Trova tutti gli utenti nel database
      .skip(skip).sort({ [sort]: sortDirection }) // Ordina i risultati
      .skip(skip) // Salta i documenti delle pagine precedenti
      .limit(limit); // Limita il numero di risultati
    
    // Conta il numero totale di utenti nel database
    const total = await BlogPosts.countDocuments();

    res.json({
      users,
      currentPage: page, // Numero della pagina corrente
      totalPages: Math.ceil(total / limit), // Calcola il numero totale di pagine
      totalUsers: total, // Numero totale di utenti nel database
    }); // Risponde con i dati degli utenti in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per ottenere un singolo utente
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Trova un utente per ID
    if (!user) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }
    res.json(user); // Risponde con i dati dell'utente in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

// Rotta per creare un nuovo utente
router.post("/", async (req, res) => {
  try {
 
    const user = new User(req.body); // Crea un nuovo utente con i dati dal corpo della richiesta
       // La password verrà automaticamente hashata grazie al middleware pre-save
    // che abbiamo aggiunto nello schema Author

    const newUser = await user.save(); // Salva il nuovo utente nel database
   
    // Rimuovi la password dalla risposta per sicurezza
    const authorResponse = newUser.toObject();
    delete authorResponse.password;
   
    const htmlContent = `
    <h1>Il tuo account è stato creato!</h1>
    <p>Ciao ${user.nome + " " + user.cognome},</p>
    <p>Il tuo account è stato creato con successo</p>
    <br>
    <br>
    <p>Per supporto contattare il seguente email: supporto@blogposts.com</p>
  `;

   await sendEmail(
     user.email,
     " Blog strive - Account creato",
     htmlContent
   );

    res.status(201).json(authorResponse); // Risponde con i dati del nuovo utente e uno status 201 (Created)
  } catch (err) {
    console.error("Errore durante la creazione dell'utente", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });  // Gestisce errori di validazione e risponde con un messaggio di errore
    }
    
  }
});

// Rotta per aggiornare un utente
router.patch("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
     { new: true }// Restituisce il documento aggiornato anziché quello vecchio
     );
    res.json(updatedUser); // Risponde con i dati dell'utente aggiornato in formato JSON
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

// Rotta per eliminare un utente
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // Elimina un utente per ID
    res.json({ message: "Autore Eliminato" }); // Risponde con un messaggio di conferma
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});

export default router; // Esporta il router per l'utilizzo in altri file

router.get("/:id/posts", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Trova un utente per ID
    if (!user) {
      return res.status(404).json({ message: "Autore non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }

    const posts = await BlogPosts.find({ user: user.email }); // Trova tutti i blogpost per utente
    res.json(BlogPosts);  // Invia la lista dei blog post come risposta JSON
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// Rotta per aggiornare un l'avatar di un utente/autore
router.patch("/:id/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Autore non trovato" });
    }

    user.avatar = req.file.path;
    await user.save();

    const htmlContent = `
     <h1>Il tuo avatar è stato aggiornato!</h1>
     <p>Ciao ${user.nome + " " + user.cognome},</p>
     <p>Il tuo avatar è stato aggiornato con successo</p>
     <br>
     <br>
     <p>Per supporto contattare il seguente email: supporto@blogposts.com</p>
   `;

    await sendEmail(
      user.email,
      "Il tuo avatar è stato aggiornato con successo",
      htmlContent
    );
    
    res.status(200).json({ message: "Avatar aggiornato con successo", user });
  } catch (err) {
    console.error("Errore durante l'aggiornamento", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Errore interno del server" });
  }
});