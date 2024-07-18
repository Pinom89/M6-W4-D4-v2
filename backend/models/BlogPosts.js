import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    name: { type: String, required: true },  // tutti i dati sono richiesti obbligatoriamente
    email: { type: String, required: true },
    comment: { type: String, required: true }
  }, {
    timestamps: true, // indica data di creazione e aggiornento
    _id: true // verifichiamo che ogni commento abbia un unico id
});

const BlogPostsSchema = new Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      value: { type: Number, required: true },
      unit: { type: String, required: true }
    },
    author: { 
      email: { type: String, required: true }
    },
    content: { type: String, required: true },
    comments: [commentSchema] // aggiungo lo scherma dei commenti
  }, {
    timestamps: true,
    collection: "blogPosts"
});

 const BlogPosts = model('BlogPosts', BlogPostsSchema);

export default BlogPosts;


   
