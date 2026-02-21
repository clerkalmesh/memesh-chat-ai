"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useEffect, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Provider({children}) {
    const [user, setUser] = useState();
    const CreateUser = useMutation(api.users.CreateNewUser);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log(user);
            
            if (user) {
                const result = await CreateUser({
                    name: user?.displayName,
                    email: user?.email,
                    pictureURL: user?.photoURL
                });
                
                console.log(result);
                setUser(result);
            }
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