"use client";

import React, { useState, useRef, Dispatch, SetStateAction, FormEvent, useEffect } from "react";
import Link from "next/link";
import { Cpu, ChevronDown, Send, Paperclip, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ThemeButton from "./theme-button";
import { aiOptions } from "@/constant/data";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuContent
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { AIProvider, Message, User } from "@/types";
import { ScrollArea } from "./ui/scroll-area";
import MessageList from "./message-list";

interface ChatInterfaceProps {
  messages: Message[];
  isAnonymous: boolean;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  sendMessageWithFile?: (text: string, file: File) => Promise<void>; // opsional
  selectedAI: AIProvider;
  setSelectedAI: Dispatch<SetStateAction<AIProvider>>;
  user: User | null;
  currentChatId: string | null;
  createNewChat: () => Promise<string | null>;
  routerPush: (url: string) => void;
}

export default function ChatInterface({
  messages,
  isAnonymous,
  isLoading,
  sendMessage,
  sendMessageWithFile,
  selectedAI,
  setSelectedAI,
  user,
  currentChatId,
  createNewChat,
  routerPush,
}: ChatInterfaceProps) {
    const [inputMessage, setInputMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    const currentAI =
        aiOptions.find((ai) => ai.id === selectedAI) || aiOptions[0];

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Batasi ukuran file 10MB
            if (file.size > 10 * 1024 * 1024) {
                alert("File terlalu besar. Maksimal 10MB.");
                return;
            }
            setSelectedFile(file);
        }
    };

    const clearSelectedFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSendMessage = async (e?: FormEvent) => {
        e?.preventDefault();
        if ((!inputMessage.trim() && !selectedFile) || isLoading) return;

        try {
            if (selectedFile) {
                // Jika ada file, gunakan sendMessageWithFile jika tersedia
                if (sendMessageWithFile) {
                    await sendMessageWithFile(inputMessage, selectedFile);
                } else {
                    // Fallback: kirim teks saja, beri tahu user
                    alert(`Model ${currentAI.name} tidak mendukung upload file. File akan diabaikan.`);
                    await sendMessage(inputMessage);
                }
                clearSelectedFile();
            } else {
                // Hanya teks
                if (user && !isAnonymous && !currentChatId) {
                    const newChatId = await createNewChat();

                    if (newChatId && newChatId !== "anonymous") {
                        await sendMessage(inputMessage);
                        setInputMessage("");
                        inputRef.current?.focus();
                        routerPush(`/chat/${newChatId}`);
                    } else {
                        throw new Error("Gagal membuat chat baru");
                    }
                } else {
                    await sendMessage(inputMessage);
                    setInputMessage("");
                    inputRef.current?.focus();
                }
            }
        } catch (error) {
            console.error("Error mengirim pesan:", error);
        }
    };

    // Scroll ke bawah ketika pesan berubah
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-screen w-full bg-background">
            <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 px-4">
                <div className="container flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="ml-8 lg:ml-0 flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                                <Cpu className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <div className="flex">
                                    <h1 className="text-lg font-semibold hidden sm:block">
                                        MEMESH AI 
                                    </h1>
                                    <Badge className="md:ml-2 border border-primary/50" variant="secondary">
                                        {isAnonymous ? "Anonim" : "Masuk"}
                                    </Badge>
                                </div>
                                
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    Banyak AI Assistant dalam satu tempat
                                </p>
                            </div>
                        </div>
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        <ThemeButton />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="max-w-[200px] justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="p-1 rounded-sm bg-secondary">
                                            <currentAI.icon className="h-4 w-4" />
                                        </div>
                                        <span>{currentAI.name}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent>
                                {aiOptions?.map((ai) => (
                                    <DropdownMenuItem 
                                        key={ai.id} 
                                        onSelect={() => setSelectedAI(ai.id as AIProvider)}
                                    >
                                        <div className="flex items-center space-x-3 p-3">
                                            <div className="flex items-center justify-center h-8 w-8 rounded-lg">
                                                <ai.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-medium">{ai.name}</h2>
                                                <p className="text-xs text-muted-foreground">{ai.description}</p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            
            {/* Area chat utama */}
            <div className="flex-1 py-6 px-4">
                <div className="space-y-6 w-full h-full flex flex-col justify-between">
                    {/* PESAN SELAMAT DATANG */}
                    {messages?.length === 0 && (
                       <div>
                        <div className="mb-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Cpu className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary/30 mb-1">
                                        Selamat datang di MESH AI YEEY🥳🥳
                                    </h3>
                                    <p className="text-primary/80 text-sm mb-2">
                                        {isAnonymous
                                            ? "Anda chatting secara anonim. Pesan tidak akan disimpan kecuali Anda masuk."
                                            : "Anda sudah masuk! Riwayat chat akan disimpan otomatis."}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-2 py-1 bg-white/10 rounded-lg text-xs">
                                            💬 Ketik pesan untuk memulai
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 bg-white/10 rounded-lg text-xs">
                                            🤖 Ganti model AI kapan saja
                                        </span>
                                        <span className="inline-flex items-center px-2 py-1 bg-white/10 rounded-lg text-xs">
                                            📎 Upload gambar/PDF (jika didukung model)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Card className="border-dashed">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-primary/20 to-primary/40">
                                        <currentAI.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            Chat dengan {currentAI?.name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {currentAI?.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto pt-4 gap-2">
                                        {[
                                            "Apa yang bisa kamu bantu?",
                                            "Jelaskan quantum computing",
                                            "Tulis cerita kreatif",
                                            "Bantu saya kode fungsi",
                                        ].map((prompt, index) => (
                                            <Button
                                                key={index}
                                                onClick={() => setInputMessage(prompt)}
                                                variant="ghost"
                                                className="h-auto p-3 text-left justify-start border"
                                            >
                                                <span>{prompt}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                       </div>
                    )}
                    {/* AKHIR PESAN SELAMAT DATANG */}
                    
                    {/* Daftar Pesan */}
                    {messages?.length > 0 && (
                        <Card className="flex-1">
                            <ScrollArea className="h-[60vh] p-4" ref={scrollRef}>
                                <MessageList
                                    messages={messages}
                                    isLoading={isLoading}
                                    currentAI={currentAI}
                                />
                            </ScrollArea>
                        </Card>
                    )}
                    {/* Area Input */}
                    <Card>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSendMessage} className="space-y-2">
                                {/* Preview file jika ada */}
                                {selectedFile && (
                                    <div className="flex items-center space-x-2 bg-secondary/50 p-2 rounded-md">
                                        <Paperclip className="h-4 w-4" />
                                        <span className="text-sm truncate flex-1">{selectedFile.name}</span>
                                        <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={clearSelectedFile}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                <div className="flex space-x-2">
                                    <Button type="button" size="icon" variant="ghost" onClick={handleFileButtonClick}>
                                        <Paperclip className="h-4 w-4" />
                                    </Button>
                                    <div className="flex-1">
                                        <Input
                                            ref={inputRef}
                                            placeholder={`Pesan untuk ${currentAI?.name}...`}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            className="min-h-12"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={(!inputMessage.trim() && !selectedFile) || isLoading}
                                        className="h-12 w-12"
                                        size="icon"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </form>
                            {/* Input file tersembunyi */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx,.txt"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}