"use client";

import dynamic from 'next/dynamic';

// Dynamic import dengan SSR dimatikan
const Topic = dynamic(() => import("./_components/topic"), { ssr: false });
const VideoStyle = dynamic(() => import("./_components/video-style"), { ssr: false });
const Voices = dynamic(() => import("./_components/voices"), { ssr: false });
const Captions = dynamic(() => import("./_components/captions"), { ssr: false });
const Preview = dynamic(() => import("./_components/preview"), { ssr: false });

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";

export default function CreateNewVideo() {
    const [formData, setFormData] = useState();
    
    const handleInputChange = (fieldName, fieldValue) => {
        setFormData(prev=> ({
            ...prev,
            [fieldName]: fieldValue
        }));
    };
    
    return (
        <div>
            <h2 className="text-3xl text-primary">Create New Video Yeey</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 mt-8">
                <div className="col-span-2 p-7 border rounded-xl h-[70vh] overflow-auto">
                    {/* topic and scripts */}
                    <Topic handleInputChange={handleInputChange}/>
                    <VideoStyle handleInputChange={handleInputChange}/>
                    <Voices handleInputChange={handleInputChange}/>
                    <Captions handleInputChange={handleInputChange}/>
                    
                    <Button className="w-full mt-5"><WandSparkles className=" text-white"/> Buat Video</Button>
                </div>
                
                <div>
                    <Preview />
                </div>
            </div>
        </div>
    );
};

