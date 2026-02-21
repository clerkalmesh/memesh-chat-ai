"use client"

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, LucideFileVideo, Search, WalletCards, Gem } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";

const menuItems = [
    {
        title: "Home",
        url: "/dashboard",
        icon: HomeIcon
    },
    {
        title: "Create New Video",
        url: "/create-new-video",
        icon: LucideFileVideo
    },
    {
        title: "Explore",
        url: "/explore",
        icon: Search
    },
    {
        title: "Billing",
        url: "/billing",
        icon: WalletCards
    }
]

export default function AppSidebar() {
    const path = usePathname();
    const { user } = useAuthContext();
    
    return (
        <Sidebar>
            <SidebarHeader>
                <div>
                    <div className="flex items-center gap-3 mt-5 justify-center w-full">
                        <Image src="/logo.png" alt="my logo" width={40} height={40} />
                        <h2 className="text-2xl font-bold text-primary">MESH AI</h2>
                    </div>
                    <h2 className="text-lg font-sans text-muted-foreground text-center">AI video generator Yeey🥳</h2>
                </div>
            </SidebarHeader>
            
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="mx-3 mt-10">
                            <Link href="/create-new-video">
                                <Button className="w-full">+ Buat Video Baru</Button>
                            </Link>
                        </div>
                        <SidebarMenu>
                            {menuItems.map((item, index) => (
                                <SidebarMenuItem className="mt-3 mx-3" key={index}>
                                    <SidebarMenuButton isActive={path === item.url} className="p-5">
                                        <Link href={item.url} className="flex items-center gap-3 p-3">
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            
            <SidebarFooter>
                <div className="p-5 rounded-lg border mb-6 bg-secondary">
                    <div className="flex items-center justify-between">
                        <Gem className="text-accent"/>
                        <h2 className="text-muted-foreground">{user?.credits || "0"} Credits</h2>
                    </div>
                    <Button className="w-full mt-3">Belih Credits</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};