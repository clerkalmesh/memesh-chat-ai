"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import AppHeader from "@/components/app-header";
import { useAuthContext } from "@/context/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardProvider({ children }) {
    const { user } = useAuthContext();
    const router = useRouter();
    
    useEffect(() => {
        user && CheckUserAuth();
        
    }, [user]);
    
    const CheckUserAuth = () => {
        if (!user) router.replace("/");
    };
    
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
                <AppHeader/>
                <div className="p-10">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
};