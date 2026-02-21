"use client";

import Image from "next/image";
import { useState } from "react";

const options = [
    {
        name: "NMAP SCANNING",
        image: "/ai/nmap.png"
    },    
    {
        name: "BRUTE FORCE ATTACK",
        image: "/ai/bruteforce.png"
   },
    {
        name: "CERITA ANAK",
        image: "/ai/anak.png"
   },
    {
        name: "CERITA SEJARAH",
        image: "/ai/sejarah.png"
   },
    {
        name: "MEMESH FILM",
        image: "/ai/memesh.png"
   },
    {
        name: "INOVASI AI",
        image: "/ai/inovasiai.png"
   },
    {
        name: "CYBER PUNK",
        image: "/ai/kucing.png"
   },
];

export default function VideoStyle({ handleInputChange }) {
    const [selectedStyle, setSelectedStyle] = useState();
    
    return (
        <div className="mt-5">
            <h2>Gaya Video</h2>
            <p className="text-sm mb-1">Pilih gaya video</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                {options?.map((option, index) => (
                    <div className="relative" onClick={() => {
                        setSelectedStyle(option.name);
                        handleInputChange("videoStyle", option.name);
                    }}
                    key={index}
                    >
                        <Image src={option.image} alt={option.name} width={500} height={120} className="object-cover h-[90px] lg:h-[130px] xl:h-[180px] p-1 rounded-lg hover:border border-primary cursor-pointer"/>
                        <h2 className="absolute bottom-1 text-primary text-center">{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};