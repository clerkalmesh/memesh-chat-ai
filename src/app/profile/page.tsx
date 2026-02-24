"use client";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/sonner";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent
} from "@/components/ui/card";

export default async function Profile() {
    const router = useRouter();
    
    const session = await auth.api.getSession({
        headers: await headers(),
        
    });
    
    if (!session) return <p className="text-destructive">Unauthorized yeey!</p>;
    
    async function Logout() {
        await signOut({
            fetchOptions: {
                onError: (ctx) => toast.error(ctx.error.message),
                onSuccess: () => {
                    toast.success("Berhasil keluar yeey🥳");
                    router.push("/login");
                },
            },
        });
    }
    
    
    return (
        <div className="flex items-center justify-center p-4 min-h-screen">
            <Card className=" w-full ">
                <CardHeader>
                    <CardTitle>Profile kamu</CardTitle>
                    <CardDescription>Detail profile</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <div className="">
                        <h2>username</h2>
                    </div>
                    
                    <pre className="">
                        {JSON.stringify(session, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
};