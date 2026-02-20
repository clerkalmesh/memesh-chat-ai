import { createContext, useContext } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    
    return context;
};