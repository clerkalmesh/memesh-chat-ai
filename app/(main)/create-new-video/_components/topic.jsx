"use client";

import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { SparklesIcon, Loader2Icon } from "lucide-react";
import axios from "axios";

const suggestions = [
  "Cerita Sejarah",
  "Brute Force Attack",
  "Nmap (Network Scanning)",
  "Cerita Anak",
  "Kisah Film",
  "Inovasi AI",
  "Teknologi Blockchain",
  "Tips Kecantikan",
  "Resep Masakan",
  "Olahraga Pagi",
  "Investasi Pemula",
  "Liburan Murah",
  "DDoS vs DoS",
];

export default function Topic({ handleInputChange }) {
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedScriptIndex, setSelectedScriptIndex] = useState(null);
  const [script, setScript] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateScripts = async () => {
    if (!selectedTopic) {
      alert("Silakan pilih atau masukkan topik terlebih dahulu");
      return;
    }

    setLoading(true);
    setSelectedScriptIndex(null);
    setScript(null);

    try {
      const prompt = `Buatkan dua naskah video yang berbeda untuk durasi 30 detik dengan topik: ${selectedTopic}. Berikan respons dalam format JSON dengan skema berikut: { scripts: [ { content: "" }, { content: "" } ] }`;

      const result = await axios.post("/api/generate-script", { prompt });
      console.log(result.data);
      setScript(result?.data?.scripts || []);
    } catch (error) {
      console.error("Gagal generate script:", error);
      alert("Terjadi kesalahan saat generate script. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-1">Judul Project</h2>
      <Input
        placeholder="Masukkan judul project..."
        onChange={(event) => handleInputChange("title", event.target.value)}
      />

      <div className="mt-5">
        <h2>Topik Video</h2>
        <p className="text-sm">Pilih topik untuk video Anda</p>

        <Tabs defaultValue="suggestion" className="w-full mt-2">
          <TabsList>
            <TabsTrigger value="suggestion">Saran</TabsTrigger>
            <TabsTrigger value="your_topic">Topik Sendiri</TabsTrigger>
          </TabsList>

          <TabsContent value="suggestion">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((sug, index) => (
                <Button
                  variant="outline"
                  key={index}
                  className={`mt-1 ${
                    sug === selectedTopic ? "bg-primary text-white" : ""
                  }`}
                  onClick={() => {
                    setSelectedTopic(sug);
                    handleInputChange("topic", sug);
                  }}
                >
                  {sug}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="your_topic">
            <div>
              <h2 className="text-sm font-medium mb-1">Topik Anda Yeey!🥳</h2>
              <Textarea
                placeholder="Ketik topik Anda di sini..."
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedTopic(value);
                  handleInputChange("topic", value);
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        {script && script.length > 0 && (
          <div className="mt-3">
            <h2 className="font-medium mb-2">Pilih Naskah/Script</h2>
            <div className="grid grid-cols-2 gap-5 mt-1">
              {script.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedScriptIndex === index ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedScriptIndex(index)}
                >
                  <p className="line-clamp-4 text-sm text-muted-foreground ">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!script && (
        <Button disabled={loading} className="mt-3" onClick={generateScripts}>
          {loading ? (
            <Loader2Icon className="animate-spin mr-2" />
          ) : (
            <SparklesIcon className="mr-2 h-4 w-4" />
          )}
          {loading ? "Memproses..." : "Generate Script Yeey!"}
        </Button>
      )}
    </div>
  );
}