"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";

export default function Provider({children}) {
    const [user, setUser] = useState();
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log(user);
            setUser(user);
        });
        
        return () => unsubscribe();
        
    }, [])
    
    return (
        <div>
            <AuthContext.Provider value={{ user }}>
                <ThemeProvider
                attribute="class"
                defaultTheme="theme-pink"
                enableSystem
                disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </AuthContext.Provider>
        </div>
    )
}