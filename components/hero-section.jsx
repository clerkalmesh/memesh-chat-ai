
import Authentication from "@/components/authentication";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
    
    return (
        <div className="p-10 flex flex-col items-center justify-center mt-24 md:px-20 lg:px-36 xl:px-48 ">
            <h2 className="font-bold text-center text-5xl text-primary">
                MESH AI Youtube Short Video Generator Edisi Yeey!
            </h2>
            <p className="text-muted-foreground mt-4 text-center text-2xl">
                Yang paling berharga dalam berkarya bukanlah peralatan mahal atau bakat instan, melainkan konsistensi untuk muncul setiap hari. 
                MESH AI hadir sebagai teman setia yang menghapus hambatan antara ide dan tayangan. 
                Anda punya pemikiran menarik pagi ini? Dalam hitungan menit, itu bisa menjadi Shorts yang menjangkau ribuan mata. 
                Karena di era di mana perhatian adalah mata uang baru, kecepatan dan kemudahan adalah segalanya. 
                Biarkan kami urusi bagian teknisnya, Anda fokus pada apa yang paling Anda kuasai: menciptakan keajaiban. 
                Mari bangun sesuatu yang berarti, satu video dalam satu waktu — yeey!
            </p>
            
            <div className="mt-7 gap-8 flex">
                <Link href="/explore"><Button size="lg" variant="secondary">Explore</Button></Link>
                <Authentication/>
            </div>
        </div>
    );
};