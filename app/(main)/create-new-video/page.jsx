"use client";

import Topic from "./_components/topic";
import VideoStyle from "./_components/video-style";
import Voices from "./_components/voices";
import Captions from "./_components/captions";
import Preview from "./_components/preview";
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
