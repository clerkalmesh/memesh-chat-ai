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
import { Github } from "lucide-react";

export default function Register() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const result = await signUp.email({
                name,
                email, 
                password
            });
            
            if (result.error) {
                setError(result.error.message || "An error occurred");
                setLoading(false);
            } else {
                router.push("/repos");
            }
        } catch (err) {
            console.error("handler email login error: ", err);
            setError(err);
            setLoading(false);
        }
    };
    
    const handleGithubRegister = async () => {
        setError("");
        setLoading(true);
        
        try {
            await signUp.social({
                provider: "github",
                callbackURL: "/repos"
            });
            
            setLoading(false);
        } catch (err) {
            console.error("handle github register error: ", err);
            setError(err);
            setLoading(false);
        }
    };
     
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 font-orbitron ">BersiapLah untuk Daftar Yeey!</CardTitle>
                    <CardDescription className="font-orbitron text-muted-foreground" >Silakan kamu pilih Daftar dengan email atau Dengan github account kamu..gitueee... yeey!</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <Button className="w-full" disabled={loading} onClick={handleGithubRegister}>
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
                    
                    <form onSubmit={handleEmailRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama kamu biar makin kenal Yeey!</Label>
                            <Input
                                id="name"
                                type="name"
                                placeholder="nama kamu biar tidak ada istila tak kenal maka tak sayang..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Dot Com Yeey!</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Masukan email.dot.com nya gituee punya..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password Rahasia Yeey!</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Buat rahasia ruang bawah tanah gituee..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        {error && <p className="text-red-500 ">⛔ {error}</p>}
                        
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Loading yeey..." : "Gas Daftar"}
                        </Button>
                    </form>
                    
                    <p className="text-center text-sm ">
                        <span className=" text-yellow-500">⚠️ Warning Yeey!</span>
                        Sudah punya accounts? Yaelaa 
                        langcung aja login gituee >>
                        <Link className="text-blue-500" href="/sign-kn">Login</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};