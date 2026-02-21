"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthContext } from "@/context/auth-context";
import Image from "next/image";

export default function AppHeader() {
    const { user } = useAuthContext();
    
    return (
        <div className="p-3 flex items-center justify-between">
            <SidebarTrigger />
            <Image src={user?.pictureURL || "/profile.png"} alt=" profile" width={40} height={40} className="rounded-full" />
            
        </div>
    );
};