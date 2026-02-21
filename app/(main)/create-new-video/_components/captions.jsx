"use client";

import { useState } from "react";

const options = [
    {
        name: "Youtuber",
        style: "text-red-500 font-bold text-2xl"
    },
    {
        name: "Supreme",
        style: "text-white bg-red-600 px-2 py-1 rounded inline-block font-bold text-xl"
    },
    {
        name: "Neon",
        style: "text-cyan-400 font-bold text-3xl italic drop-shadow-[0_0_10px_cyan]"
    },
    {
        name: "Fire",
        style: "text-orange-500 font-bold text-3xl drop-shadow-[0_0_10px_orangered]"
    },
    {
        name: "Glitch",
        style: "text-purple-500 font-bold text-3xl [text-shadow:2px_2px_0_red,-2px_-2px_0_blue]"
    },
    {
        name: "Futuristic",
        style: "text-blue-400 font-mono text-3xl tracking-widest"
    }
];

export default function Captions({ handleInputChange }) {
    const [selectedCaption, setSelectedCaption] = useState();

    return (
        <div className="mt-5">
            <h2 className="font-medium">Gaya Caption</h2>
            <p className="text-sm text-muted-foreground mb-2">Pilih gaya caption</p>

            <div className="flex flex-wrap gap-3">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={`p-3 hover:border border-primary cursor-pointer bg-slate-900 rounded-lg transition-all ${
                            selectedCaption === option.name ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => {
                            setSelectedCaption(option.name);
                            handleInputChange(option);
                        }}
                    >
                        <h2 className={option.style}>{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
}