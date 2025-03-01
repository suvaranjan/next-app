"use client";

import * as React from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Initialize dark mode from localStorage on component mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background px-5">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">HindiTGT</span>
        </Link>

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px] p-6">
              <nav className="flex flex-col gap-6 mt-6">
                <Link
                  href="/"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/read"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  Read
                </Link>
                <Link
                  href="/test"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  Test
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="mt-4"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/read"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Read
          </Link>
          <Link
            href="/test"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Test
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
