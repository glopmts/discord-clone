"use client"

import { Check, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Efeito para evitar hidratação incorreta
  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    {
      id: 1,
      label: "Claro",
      value: "light",
      color: "#ffffff",
      icon: null
    },
    {
      id: 2,
      label: "Escuro",
      value: "dark",
      color: "#000000",
      icon: null
    },
    {
      id: 3,
      label: "Sistema",
      value: "system",
      color: "transparent",
      icon: <Monitor className="w-4 h-4 text-foreground" />
    }
  ];

  if (!mounted) {
    return null;
  }

  // Determina qual tema está ativo considerando o tema do sistema
  const activeTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex items-center gap-3 mt-2">
      {themes.map((tm) => {
        const isActive =
          tm.value === "system"
            ? theme === "system"
            : tm.value === activeTheme;

        return (
          <TooltipProvider key={tm.id} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(tm.value)}
                  className={`
                    w-9 h-9 rounded-full cursor-pointer 
                    hover:opacity-80 transition-all
                    flex items-center justify-center
                    relative
                    ${tm.value !== "system" ? "border" : ""}
                    ${isActive ? "border-blue-600" : ""}
                  `}
                  style={{
                    backgroundColor: tm.value !== "system" ? tm.color : "var(--background)"
                  }}
                >
                  {tm.icon}
                  {isActive && tm.value !== "system" && (
                    <Check className="w-4 h-4 absolute text-blue-500" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent align="end">
                <p>{tm.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}