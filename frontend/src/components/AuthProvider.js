import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
    const [authorLogin, setAuthorLogin] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={{ authorLogin, setAuthorLogin, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}
