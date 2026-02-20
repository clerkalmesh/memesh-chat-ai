"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import ThemeButton from "@/components/theme-button";
import Authentication from "@/components/authentication";
import { useAuthContext } from "@/context/auth-context";

export default function Header() {
    const { user } = useAuthContext();
    
    return (
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="my logo" width={40} height={40} />
                <h2 className="text-2xl font-bold text-primary">MESH AI</h2>
            </div>
            
            <di className="flex items-center gap-3">
                <ThemeButton />
                {!user ? (
                    
                    <Authentication>
                        <Button>Get Started</Button>
                    </Authentication>
                ) : (
                    <div className="flex items-center gap-3">
                        <Button >Dashboard</Button>
                        <Image src={user?.photoURL || "/profile.png"} alt="user profile" width={40} height={40} className="rounded-full" />
                    </div>
                )}
            </div>
        </div>
    );
};