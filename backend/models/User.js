import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

// Definizione dello schema dell'utente utilizzando il costruttore Schema di Mongoose
const userSchema = new Schema(
  {
   
    nome: {
      type: String,
      required: true,
    },

    cognome: {
      type: String,
     
    },

    email: {
      type: String,
      unique: true,
      
    },

    datadinascita: {
      type: Date,
      
    },
    
    avatar: {
      type: String,
      required: false,
    },

    password: {
      type: String,
     
    },
    googleId: { 
      type: String 
    },
    githubId: { 
      type: String 
    },
   
  },
  {
    timestamps: true,
    // Opzioni dello schema:
    collection: "autori", // Specifica il nome della collezione nel database MongoDB
  }
);

// Metodo per confrontare le password
userSchema.methods.comparePassword =  function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware per l'hashing della password prima del salvataggio 
userSchema.pre("save", async function (next) {
  // Esegui l'hashing solo se la password è stata modifica (o è nuova)
  if (!this.isModified("password")) return next();

  try {
    // Genera un salt e hash la password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } 
  catch (error) {
    next(error);
  }
});
  



// Esporta il modello 'User' utilizzando il metodo model di Mongoose
// Il modello 'User' sarà basato sullo schema 'userSchema' definito sopra
const User = model("User", userSchema);
export default User;