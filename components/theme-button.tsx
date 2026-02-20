"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Daftar tema kustom yang tersedia (sesuai dengan kelas CSS di globals.css)
const colorThemes = [
  { value: "theme-pink", label: "Pink" },
  { value: "theme-green", label: "Green" },
  { value: "theme-orange", label: "Orange" },
  { value: "theme-violet", label: "Violet" },
  { value: "theme-yellow", label: "Yellow" },
  { value: "theme-peach", label: "Peach" },
  { value: "theme-lavender", label: "Lavender" },
  { value: "theme-red", label: "Red"}
]

export default function ThemeButton() {
  const { theme, setTheme } = useTheme()

  // Cari tema yang sedang aktif untuk ditampilkan di tombol
  const activeTheme = colorThemes.find(t => t.value === theme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {activeTheme ? activeTheme.label : "Theme"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colorThemes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className="flex items-center justify-between text-white"
          >
            {t.label}
            {theme === t.value && <Check className="ml-2 h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}