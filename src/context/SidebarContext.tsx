"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
    open: boolean;
    toggle: () => void;
    setOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(true);

    const toggle = () => setOpen((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ open, toggle, setOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
