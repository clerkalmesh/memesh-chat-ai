"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  addMessage,
  createChat,
  subscribeToMessages,
  subscribeToUserChatsSimple,
  deleteChat as deleteChatFromDB,
} from "@/lib/firestore";
import { AIService } from "@/lib/aiServices";
import { Message, Chat, AIProvider } from "@/types";

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAI, setSelectedAI] = useState<AIProvider>("chatgpt");
  const [anonymousMessages, setAnonymousMessages] = useState<Message[]>([]);

  // Berlangganan ke daftar chat pengguna (hanya untuk pengguna terautentikasi)
  useEffect(() => {
    if (!user || user.isAnonymous) {
      setChats([]);
      setCurrentChatId(null);
      return;
    }

    const unsubscribe = subscribeToUserChatsSimple(user.uid, (userChats) => {
      setChats(userChats);
    });

    return () => unsubscribe();
  }, [user]);

  // Berlangganan ke pesan dari chat saat ini (hanya untuk pengguna terautentikasi)
  useEffect(() => {
    if (!currentChatId || !user || user.isAnonymous) {
      if (!user?.isAnonymous) {
        setMessages([]);
      }
      return;
    }

    const unsubscribe = subscribeToMessages(currentChatId, (chatMessages) => {
      setMessages(chatMessages);
    });

    return () => unsubscribe();
  }, [currentChatId, user]);

  // Menangani pesan untuk pengguna anonim
  useEffect(() => {
    if (user?.isAnonymous) {
      setMessages(anonymousMessages);
    }
  }, [anonymousMessages, user]);

  // Reset state ketika user berubah
  useEffect(() => {
    if (user?.isAnonymous) {
      setCurrentChatId(null);
      setMessages(anonymousMessages);
    } else if (user) {
      setMessages([]);
    } else {
      setCurrentChatId(null);
      setMessages([]);
      setAnonymousMessages([]);
    }
  }, [user?.uid, user?.isAnonymous]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || !user) return;

      setIsLoading(true);

      try {
        if (user.isAnonymous) {
          const userMessage: Message = {
            id: `msg_${Date.now()}`,
            text,
            sender: "user",
            timestamp: new Date().toISOString(),
            ai: selectedAI,
            chatId: "anonymous",
            userId: user.uid,
          };

          setAnonymousMessages((prev) => [...prev, userMessage]);

          const aiResponse = await AIService.callAI(text, selectedAI);

          const aiMessage: Message = {
            id: `msg_${Date.now() + 1}`,
            text: aiResponse.success
              ? aiResponse.text
              : `Maaf, terjadi kesalahan: ${aiResponse.error}`,
            sender: "ai",
            timestamp: new Date().toISOString(),
            ai: selectedAI,
            chatId: "anonymous",
            userId: user.uid,
          };

          setAnonymousMessages((prev) => [...prev, aiMessage]);
        } else {
          let chatId = currentChatId;

          if (!chatId) {
            const chatTitle =
              text.length > 50 ? text.substring(0, 50) + "..." : text;
            chatId = await createChat(chatTitle, selectedAI, user.uid);
            setCurrentChatId(chatId);
          }

          await addMessage(chatId, text, "user", selectedAI, user.uid);

          const aiResponse = await AIService.callAI(text, selectedAI);

          const responseText = aiResponse.success
            ? aiResponse.text
            : `Maaf, terjadi kesalahan: ${aiResponse.error}`;

          await addMessage(chatId, responseText, "ai", selectedAI, user.uid);
        }
      } catch (error) {
        console.error("Error mengirim pesan:", error);

        const errorMessage: Message = {
          id: `error_${Date.now()}`,
          text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          sender: "ai",
          timestamp: new Date().toISOString(),
          ai: selectedAI,
          chatId: user.isAnonymous ? "anonymous" : currentChatId || "unknown",
          userId: user.uid,
        };

        if (user.isAnonymous) {
          setAnonymousMessages((prev) => [...prev, errorMessage]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentChatId, selectedAI, user, isLoading]
  );

  const createNewChat = useCallback(async () => {
    if (!user) {
      console.log("Tidak ada user tersedia");
      return null;
    }

    if (user.isAnonymous) {
      console.log("Menghapus pesan anonim");
      setAnonymousMessages([]);
      setCurrentChatId(null);
      setMessages([]);
      return "anonymous";
    } else {
      console.log("Membuat chat baru di Firestore");
      const chatTitle = "Chat Baru";
      const chatId = await createChat(chatTitle, selectedAI, user.uid);
      setCurrentChatId(chatId);
      setMessages([]);
      return chatId;
    }
  }, [user, selectedAI]);

  const selectChat = useCallback(
    (chatId: string) => {
      if (!user || user.isAnonymous) {
        console.log("Tidak dapat memilih chat - user anonim atau belum login");
        return;
      }

      setCurrentChatId(chatId);
      // setMessages([]);
    },
    [user, chats]
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      if (!user || user.isAnonymous) {
        console.log("Tidak dapat menghapus chat - user anonim atau belum login");
        return;
      }

      console.log("Menghapus chat:", chatId);

      try {
        await deleteChatFromDB(chatId);

        if (currentChatId === chatId) {
          console.log("Chat saat ini dihapus, mereset state");
          setCurrentChatId(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error menghapus chat:", error);
      }
    },
    [currentChatId, user]
  );

  const clearAnonymousChat = useCallback(() => {
    if (user?.isAnonymous) {
      setAnonymousMessages([]);
    }
  }, [user]);

  return {
    messages: user?.isAnonymous ? anonymousMessages : messages,
    chats: user?.isAnonymous ? [] : chats,
    currentChatId: user?.isAnonymous ? null : currentChatId,
    isLoading,
    selectedAI,
    setSelectedAI,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    clearAnonymousChat,
    isAnonymous: user?.isAnonymous || false,
  };
};