"use client";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { FaMoon } from "react-icons/fa";
import { FaSun } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import LogoutButton from "./logout-button";
import { useTheme } from 'next-themes'
import { useEffect } from "react";
import UpdateSettings from "@/app/(protected)/dashboard/_components/update-settings";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";


export const UserButton = () => {
  const user = useCurrentUser();
  const {theme, setTheme} = useTheme()

  useEffect(() => {
    // This useEffect hook ensures that localStorage is accessed only client-side
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // If no theme is stored, default to 'light' or your preferred default theme
      localStorage.setItem("theme", "light");
    }
  }, [setTheme]);

  useEffect(() => {
    // Also ensure theme changes are persisted to localStorage only client-side
    if (theme && theme !== "system") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center gap-3 w-full">
          <Avatar>
            <AvatarImage src={ user?.image || "" }/>
            <AvatarFallback className="bg-black dark:bg-white">
              <FaUser className="text-white dark:text-black"/>
            </AvatarFallback>
          </Avatar>
          <p>{user?.name}</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <LogoutButton>
            <DropdownMenuItem className=" hover:cursor-pointer">
              <ExitIcon className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </LogoutButton>
          <DropdownMenuItem className=" hover:cursor-pointer" onClick={() => toggleTheme()}>
            {theme === 'light' ? <FaMoon className="mr-2 h-4 w-4" /> : <FaSun size={4} className="mr-2 h-4 w-4" />}
            {theme === 'light' ? "dark" : "light"}
          </DropdownMenuItem>
          <Sheet>
            <SheetTrigger className="w-full hover:cursor-pointer dark:hover:bg-slate-800 hover:bg-slate-100
            relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <FaGear className="h-4 w-4 mr-2"/>
              User Settings
            </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Update your settings</SheetTitle>
                  <SheetDescription>
                    <UpdateSettings />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}