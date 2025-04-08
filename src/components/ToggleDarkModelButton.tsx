"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/context/ThemeContext";

const ToggleDarkModeButton = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Button
            onClick={toggleTheme}
            size="icon"
            className="nav-button flex items-center justify-center w-7 h-7"
            aria-label="Toggle Theme"
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-black" />
            ) : (
                <Moon className="w-5 h-5 text-white" />
            )}
        </Button>
    );
};

export default ToggleDarkModeButton;
