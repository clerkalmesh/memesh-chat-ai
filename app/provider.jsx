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
                    attribute="data-theme"  // gunakan data-theme, bukan class
                    defaultTheme="theme-pink"
                    enableSystem={false}    // matikan system theme
                    themes={[
                        "theme-pink",
                        "theme-green",
                        "theme-orange",
                        "theme-violet",
                        "theme-yellow",
                        "theme-peach",
                        "theme-lavender",
                        "theme-red"
                    ]}
                    storageKey="mesh-theme"
                    disableTransitionOnChange
                 >
                    {children}
                </ThemeProvider>
            </AuthContext.Provider>
        </div>
    )
}