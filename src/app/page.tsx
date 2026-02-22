import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import HealthCheck from "@/components/health-check";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center ">
        <div>
            <h1>Welcome to memesh ai code reviewers yeey🥳</h1>
            <p>Starting reviewing your code today!</p>
        </div>
        
        <div className="flex gap-4">
            <Button variant="secondary" asChild>
                <Link href="/login">Login Ajalah</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Daftar Dulu Yeey!</Link>
            </Button>
            
            
            <HealthCheck/>
        </div>
    </div>
  );
}
