"use client";

import { ArrowRightIcon, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/branding/logo.webp";
import { NAVBAR_LINKS } from "@/config";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="transition-transform duration-200 hover:scale-105"
          >
            <Image src={Logo} alt="OpenMC Logo" width={160} height={40} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <Button asChild>
              <Link href="/join">
                Rejoindre le Serveur
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-4 [&>button]:hidden"
            >
              <div className="flex justify-between items-center">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Image
                      src={Logo}
                      alt="OpenMC Logo"
                      width={150}
                      height={30}
                    />
                  </SheetTitle>
                </SheetHeader>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-4 mt-6">
                {NAVBAR_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      className="block py-2 px-4 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors duration-200 font-medium"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Button asChild className="w-full">
                    <Link href="/join">
                      Rejoindre le Serveur
                      <ArrowRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
