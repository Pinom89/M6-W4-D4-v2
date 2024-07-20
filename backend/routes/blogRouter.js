import BlogPosts from "../models/BlogPosts.js";
import express from "express"; // Importa il pacchetto Express
import cloudinaryUploader from "../config/claudinaryConfig.js";
import { sendEmail } from "../services/emailservices.js";
import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router(); // Crea un router Express
// Creazione Rotte per BlogPosts

// Rotta per ottenere tutti gli Posts
router.get("/", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Estrae il numero di pagina dalla query, default a 1 se non specificato
      const limit = parseInt(req.query.limit) || 12; // Estrae il limite di risultati per pagina, default a 10
      const sort = req.query.sort || "name"; // Determina il campo per l'ordinamento, default a "name"
      const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // Determina la direzione dell'ordinamento (1 per ascendente, -1 per discendente)
      const skip = (page - 1) * limit; // Calcola quanti documenti saltare per arrivare alla pagina richiesta
  
        // Esegue la query al database con paginazione, ordinamento e limite
      const blogPosts = await BlogPosts.find({}) // Trova tutti gli utenti nel database
        .sort({ [sort]: sortDirection }) // Ordina i risultati
        .skip(skip) // Salta i documenti delle pagine precedenti
        .limit(limit); // Limita il numero di risultati
  
       // Conta il numero totale di utenti nel database
       const total = await BlogPosts.countDocuments();
  
      res.json({
        blogPosts, // Array degli utenti per la pagina corrente
        currentPage: page, // Numero della pagina corrente
        totalPages: Math.ceil(total / limit), // Calcola il numero totale di pagine
        totalUsers: total, // Numero totale di utenti nel database
      }); // Risponde con i dati degli utenti in formato JSON
    } catch (err) {
      res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
    }
  });
  

  // Rotta per ottenere un singolo Post
  router.get("/:id", async (req, res) => {
    try {
      const blogPost = await BlogPosts.findById(req.params.id); // Trova un utente per ID
      if (!blogPost) {
        return res.status(404).json({ message: "Blog non trovato" }); // Se l'utente non esiste, risponde con un errore 404
      }
      res.json(blogPost); // Risponde con i dati dell'utente in formato JSON
    } catch (err) {
      res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
    }
  });

  // NEW! Proteggi le altre rotte con il middleware di autenticazione
  router.use(authMiddleware);



  
  // Rotta per creare un nuovo Post
  router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
    // Crea un nuovo utente con i dati dal corpo della richiesta
   
    try {
      const blogPost =  req.body;
      if (req.file) {
        blogPost.cover = req.file.path; // Cloudinary restituirà direttamente il suo url
      }
      const newBlogPost = new BlogPosts(blogPost);
      await newBlogPost.save(); // Salva il nuovo utente nel database

        // CODICE PER INVIO MAIL con MAILGUN
    const htmlContent = `
      <h1>Il tuo post è stato pubblicato!</h1>
      <p>Ciao ${newBlogPost.author.email},</p>
      <p>Il tuo post "${newBlogPost.title}" è stato pubblicato con successo.</p>
      <p>Categoria: ${newBlogPost.category}</p>
      <p>Grazie per il tuo contributo al blog!</p>
    `;

    await sendEmail(
      newBlogPost.author.email, // Ovviamente assumendo che newPost.author sia l'email dell'autore
      "Il tuo post è stato correttamente pubblicato",
      htmlContent
    );
    

      res.status(201).json(newBlogPost); // Risponde con i dati del nuovo utente e uno status 201 (Created)
    } catch (err) {
      res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
    }
  });
  
  // Rotta per aggiornare un Post
  router.patch("/:id", async (req, res) => {
    try {
      const updateBlogPosts = await BlogPosts.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Restituisce il documento aggiornato anziché quello vecchio
      });
      if (!updateBlogPosts) {
        // Se il blog post non viene trovato, invia una risposta 404
        return res.status(404).json({ message: "Blog post non trovato" });
      }
      res.json(updateBlogPosts); // Risponde con i dati dell'utente aggiornato in formato JSON
    } catch (err) {
      res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
    }
  });
  
  // Rotta per eliminare un Post
  

router.delete("/:id", async (req, res) => {
  try {
    // Trova il blog post dal database
    const blogPost = await BlogPosts.findById(req.params.id);
    if (!blogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    // Estrai l'public_id da Cloudinary dall'URL della cover
    const publicId = `blog_covers/${blogPost.cover.split('/').pop().split('.')[0]}`;
    console.log("Extracted publicId:", publicId);
    // Elimina l'immagine da Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary deletion result:", result);
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
    }

    // Elimina il blog post dal database
    await BlogPosts.findByIdAndDelete(req.params.id);

    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: "Blog post e immagine di copertina eliminati" });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});



  router.patch("/:id/cover", cloudinaryUploader.single("cover"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }
      const blogpost = await BlogPosts.findById(req.params.id);
      if (!blogpost) {
        return res.status(404).json({ message: "Blog non trovato" });
      }
      blogpost.cover = req.file.path;
    await blogpost.save();
     
    const htmlContent = `
    <h1>Modifica eseguita</h1>
    <p>Gentile utente, </p>
    <p> sull'account ${blogpost.author.email} è stata apportata una modifica.</p>
    <p>La tua cover è stata aggiornata!</p>
    <br>
    <br>
    <p>Per supporto contattare la seguente email: customersupport@blogposts.com</p>
  `;

   await sendEmail(
     blogpost.author.email,
     // oggetto della email
     "Il tuo avatar è stato aggiornato con successo",
     htmlContent
   );
   
   res.status(200).json({ message: "Cover aggiornata con successo", blogpost });
    } catch (err) {
      res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
    }
  });
  
 // creazione rotta blogPosts/:id/comments' per mostrare i commenti   
  router.get("/:id/comments", async (req, res) => {
    try {
      const blogPost = await BlogPosts.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      res.json(blogPost.comments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

   // blogPosts/:id/comments per creare nuovi commenti

  router.post("/:id/comments", async (req, res) => {
    try {
      const blogPost = await BlogPosts.findById(req.params.id);
      if (!blogPost) {
        return res.status(404).json({ message: "Post non trovato" });
      }
  
      const newComment = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment
      };
  
      blogPost.comments.push(newComment);
      await blogPost.save();
  
      const htmlContent = `
        <h1>Creazione eseguita</h1>
        <p>Gentile ${newComment.name}, </p>
        <p> sull'account ${newComment.email} è stata inserito un commento.</p>
        <br>
        <br>
        <p>Per supporto contattare la seguente email: customersupport@blogposts.com</p>
      `;
  
      try {
        await sendEmail(
          newComment.email,
          "Il tuo commento è stato creato con successo",
          htmlContent
        );
      } catch (emailError) {
        console.error("Errore durante l'invio dell'email:", emailError.message);
        // Non facciamo nulla qui, permettiamo al codice di continuare
      }
  
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
 

  // Creo la patch per modificare un commento specifico di un singolo commento
  router.patch("/:id/comments/:commentId", async (req, res) => {
    try {
      const blogPost= await BlogPosts.findById(req.params.id);
      if (!blogPost) {
        return res.status (404).json ({ message: "Post non trovato" });
      }
      const comment = blogPost.comments.id (req.params.commentId);
      if (!comment) {
        return res.status (404).json ({ message: "Commento non trovato" });
      }
      if (req.body.name) comment.name = req.body.name; 
      if (req.body.email) comment.email = req.body.email;
      if (req.body.comment) comment.comment = req.body.comment;
      await blogPost.save();
      res.json (blogPost);
    } catch (err){
      res.status(400).json ({message: err.message});
    }
  })
      
  router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      const blogPost= await BlogPosts.findById(req.params.id);
      if (!blogPost) {
        return res.status (404).json ({ message: "Post non trovato" });
      }
      const comment = blogPost.comments.id (req.params.commentId);
      if (!comment) {
        return res.status (404).json ({ message: "Commento non trovato" });
      }
      blogPost.comments.pull({ _id: req.params.commentId });
      await blogPost.save();
      res.json ({ blogPost, message: "Commento eliminato con successo"});
    } catch (err) {
      res.status (500).json ({ message: err.message });
    }
  })






 // creazione rotte '/api/blogPosts/:id/comments/:commentId'
  export default router; // Esporta il router per l'utilizzo in altri file