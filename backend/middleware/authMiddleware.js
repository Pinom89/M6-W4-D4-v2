import {verifJWT}  from "../utils/jwt.js";
import User from "../models/User.js";

// Middeleware per controllare l'autenticazione di un utente

export const authMiddleware = async (req, res, next) => {
    try{
        // Estrai il token dall'header Authorization
          // L'operatore ?. (optional chaining) previene errori se authorization è undefined
    // replace('Bearer ', '') rimuove il prefisso 'Bearer ' dal token
    const token = req.headers.authorization?.replace("Bearer ", "");

    //  Se non c'è alcun token, restituisce un errore 401 Unauthorized
    if (!token) {
        return res.status(401).send("Token mancante");
    }
    // Verifica e decodifica il token usando la funzione verifJWT
    // Se il toke è valido, decoded conterrà il payload del token (es. id: '123')

    const decoded = await verifJWT(token);

        // Usa l'ID dell'autore dal token per trovare l'autore nel database
    // .select('-password') esclude il campo password dai dati restituiti
    const user = await User.findById(decoded.id).select("-password");

    // Se l'autore non viene trovato nel database, restituisci un errore 401
    if (!user) {
        return res.status(401).send("Utente non trovato");
}
       // Aggiungi l'oggetto author alla richiesta
    // Questo rende i dati dell'autore disponibili per le route successive
    req.user = user;
     // Passa al prossimo middleware o alla route handler
    next();

    }catch(err){
        res.status(401).send("Token non valido");
    }   
};