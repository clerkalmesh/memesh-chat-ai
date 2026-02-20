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
  const [mounted, setMounted] = React.useState(false)

  // Set mounted = true setelah komponen terpasang di client
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = colorThemes.find(t => t.value === theme)

  // Sebelum mounted, render tombol placeholder (misalnya dengan ukuran yang sama) 
  // agar layout tidak bergeser saat hidrasi.
  if (!mounted) {
    return (
      <Button variant="secondary" size="sm" className="gap-2 invisible">
        Pink
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
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