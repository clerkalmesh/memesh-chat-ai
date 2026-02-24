"use client";

import React, {useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Github, ArrowBigLeft } from "lucide-react";

export default function Login() {
    const router = useRouter();
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        
    };
     
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <Link href="/" className="my-4">
                    <Button variant="destructive" size="icon"><ArrowBigLeft className="text-xl text-white"/></Button>
                </Link>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-primary ">BersiapLah untuk Login Yeey!</CardTitle>
                    <CardDescription className="text-muted-foreground" >Silakan kamu pilih login dengan email atau Dengan github account kamu..gitueee... yeey!</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <Button className="w-full" >
                        <Github className="text-white mr-2 size-4" />
                        Login dengan github aja aaa?
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <Separator className="w-full"/>
                        </div>
                        
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Atau login dengan email aja gituee</span>
                        </div>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="rahasia ruang bawah tanah gituee..."
                                
                            />
                        </div>
                        
                        
                        <Button className="w-full" type="submit" >
                            Gass Login
                        </Button>
                    </form>
                    
                    <p className="text-center text-sm ">
                        <span className=" text-yellow-500">⚠️ Warning Yeey!</span>
                        Belum punya accounts? Yaelaa kasian abiess dee
                        langcung aja mendaftar gituee 
                        <Link className="text-blue-500" href="/register">Daftar</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};