"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const options = [
    {
        name: "🇲🇨 Memesh (cewe)",
        value: "memesh.mp3"
    },
    {
        name: "🇲🇨 Putri (cewe)",
        value: "put"
    },
    {
        name: "🇲🇨 Tuan Johan (cowo)",
        value: "johan"
    },
    {
        name: "🇲🇨 Clerk Almesh (cewe)",
        value: "clerk"
    },
    {
        name: "🇲🇨 Almesh Yeey (cewe)",
        value: "yeeyh.mp3"
    },
    {
        name: "🇲🇨 Otong Surotong (cowo)",
        value: "otong"
    },
    {
        name: "🇱🇷 Bellamy (cowo)",
        value: "bellamy"
    },
    {
        name: "🇱🇷 Karen (cewe)",
        value: "karen"
    },
    {
        name: "🇪🇭 Rowan Justin (cowo)",
        value: "rowam"
    },
    {
        name: "🇪🇭 Bibit Unggul (cewe)",
        value: "bibit"
    }
];

export default function Voices({handleInputChange}) {
    const [selectedVoice, setSelectedVoice] = useState();
    
    return (
        <div className="mt-5">
            <h2 className="">Suara Video</h2>
            <p className="text-sm">Pilih suara untuk video andah</p>
            
            <ScrollArea className="h-[70px] w-full">
                <div className="grid grid-cols-2 gap-3">
                    {options.map((option, index) => (
                        <h2 className="cursor-pointer p-3 rounded-lg bg-slate-900 text-white hover:border hover:border-primary" onClick={() => {
                            setSelectedVoice(option.name);
                            handleInputChange("voice", option.value);
                            
                        }} key={index} >{option.name}</h2>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}