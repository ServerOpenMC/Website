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
    <div className="fixed top-0 left-0 right-0 z-50 navbar-light bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="transition-all duration-300 hover:scale-105 relative group"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <Image src={Logo} alt="OpenMC Logo" width={160} height={40} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAVBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex">
            <Button size="lg" className="unified-button-primary group" asChild>
              <Link href="/join">
                Rejoindre le Serveur
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] p-6 [&>button]:hidden glass-effect-strong border-l border-border/50"
            >
              <div className="flex justify-between items-center mb-8">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col gap-2">
                {NAVBAR_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      className="block py-3 px-4 text-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 font-medium"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <SheetClose asChild>
                    <Button
                      size="lg"
                      className="w-full unified-button-primary group"
                      asChild
                    >
                      <Link href="/join">
                        Rejoindre le Serveur
                        <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </SheetClose>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
