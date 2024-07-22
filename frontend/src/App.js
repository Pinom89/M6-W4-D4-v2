import React, { useState } from "react";
import NavBar from "./components/navbar/BlogNavbar.jsx";
import Footer from "./components/footer/Footer.jsx";
import Home from "./views/home/Home.jsx";
import Blog from "./views/blog/Blog.jsx";
import Autori from "./components/autori/Autori.jsx";
import NotFound from "./components/notfound/NotFound.jsx";
import EditBlog from "./components/editblog/EditBlog.jsx";
import NewBlogPost from "./views/new/New.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./views/register/Register.jsx";
import Login from "./views/login/Login.jsx";
import { AuthProvider } from "./components/AuthProvider.js";
import { ThemeContext } from "./components/AuthContext.js";



function App() {
  const [theme, setTheme] = useState("light");
  return (
    <AuthProvider>
      <ThemeContext.Provider value={[theme, setTheme]}>
      <div style={{
        backgroundColor: theme === "light" ? "#fff" : "#DDDDDD",
      }}>  
        <Router>
          <NavBar />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/authors" element={<Autori />} />
              <Route path="/new" element={<NewBlogPost />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/edit/:id" element={<EditBlog />} />
              <Route path="/author/register"element={<Register/>} />
              <Route path="/login" element={<Login />} />
            </Routes>
          <Footer />
        </Router>
      </div>
    </ThemeContext.Provider >
  </AuthProvider>
  );
}

export default App;
