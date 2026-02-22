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
import { Github } from "lucide-react";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const result = await signIn.email({
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
    
    const handleGithubLogin = async () => {
        setError("");
        setLoading(true);
        
        try {
            await signIn.social({
                provider: "github",
                callbackURL: "/repos"
            });
            
            setLoading(false);
        } catch (err) {
            console.error("handle github login error: ", err);
            setError(err);
            setLoading(false);
        }
    };
     
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 font-orbitron ">BersiapLah untuk Login Yeey!</CardTitle>
                    <CardDescription className="font-orbitron text-muted-foreground" >Silakan kamu pilih login dengan email atau Dengan github account kamu..gitueee... yeey!</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <Button className="w-full" disabled={loading} onClick={handleGithubLogin}>
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
                    
                    <form onSubmit={handleEmailLogin} className="space-y-4">
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
                                placeholder="rahasia ruang bawah tanah gituee..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        
                        {error && <p className="text-red-500 ">⛔ {error}</p>}
                        
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Loading yeey..." : "Gas Login"}
                        </Button>
                    </form>
                    
                    <p className="text-center text-sm ">
                        <span className=" text-yellow-500">⚠️ Warning Yeey!</span>
                        Belum punya accounts? Yaelaa kasian abiess dee
                        langcung aja mendaftar gituee >>
                        <Link className="text-blue-500" href="/sign-up">Daftar</Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};