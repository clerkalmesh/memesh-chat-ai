"use client";

import React, {useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Github, ArrowBigLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export default function Register() {
    const router = useRouter();
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData(event.target as HTMLFormElement);
        
        const name = String(formData.get("name"));
        if (!name) return toast.error("Oono Please masukan name😭!");
        
        const email = String(formData.get("email"));
        if (!email) return toast.error("Oono Please masukan email😭!");
        
        const password = String(formData.get("password"));
        if (!password) return toast.error("Oono Please masukan password😭!");
        
        try {
            await signUp.email(
                { name, email, password },
                {
                    onRequest: () => {},
                    onResponse: () => {},
                    onError: (ctx) => {
                        toast.error(ctx.error.message);
                    },
                    onSuccess: () => {}
                }
            );
        } catch (err) {
            console.error("error signup : ", error);
            toast.error("Terjadi kesalahan saat daftar😪");
        }
    };
    
    
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <Link href="/" className="my-4">
                    <Button variant="destructive" size="icon"><ArrowBigLeft className="text-xl text-white"/></Button>
                </Link>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-primary font-bold ">BersiapLah untuk Daftar Yeey!</CardTitle>
                    <CardDescription className="font-orbitron text-muted-foreground" >Silakan kamu pilih Daftar dengan email atau Dengan github account kamu..gitueee... yeey!</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <Button className="w-full"  >
                        <Github className="text-white mr-2 size-4" />
                        Daftar dengan github aja aaa?
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full"/>
                        </div>
                        
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Atau daftar dengan email aja gituee</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama kamu biar makin kenal Yeey!</Label>
                            <Input
                                id="name"
                                name="name"
                                type="name"
                                placeholder="nama kamu biar tidak ada istila tak kenal maka tak sayang..."
                                
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Dot Com Yeey!</Label>
                                <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Masukan email.dot.com nya gituee punya..."
                                
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password Rahasia Yeey!</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Buat rahasia ruang bawah tanah gituee..."
                                
                            />
                        </div>
                        
                        
                        <Button className="w-full" type="submit" >
                            Daftar Accounts
                        </Button>
                    </form>
                    
                    <p className="text-center text-sm ">
                        <span className=" text-yellow-500">⚠️ Warning Yeey!</span>
                        Sudah punya accounts? Yaelaa 
                        langcung aja login gituee >>
                        <Link className="text-blue-500" href="/login">Login</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};