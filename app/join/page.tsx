"use client";

import { Check, Copy, Server, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "@/public/branding/logoomc.png";
import { useState } from "react";

export default function Page() {
  const [copied, setCopied] = useState(false);
  const serverIP = "play.openmc.fr";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serverIP);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-20">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl scale-110"></div>
              <div className="relative glass-effect rounded-2xl p-6">
                <Image
                  src={Logo}
                  alt="Logo du serveur"
                  width={120}
                  height={120}
                  className="mx-auto"
                />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-center mb-4">
            Rejoindre le Serveur Minecraft
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
            Connecte-toi et viens construire avec nous ! 🎮
          </p>
        </div>

        {/* Server Connection Card */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 rounded-3xl border border-primary/20 p-8 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Server className="h-6 w-6 text-primary" />
              <h2 className="text-2xl md:text-3xl font-bold text-center">
                Adresse du serveur
              </h2>
            </div>

            {/* Online Status */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Serveur en ligne</span>
              </div>
            </div>

            {/* IP Address Display */}
            <div className="glass-effect rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center lg:text-left">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Adresse IP
                  </p>
                  <p className="font-mono text-xl md:text-2xl font-bold text-primary break-all">
                    {serverIP}
                  </p>
                </div>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="unified-button-secondary shrink-0 hover:scale-105"
                  aria-label="Copier l'adresse IP du serveur"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                onClick={handleCopy}
                size="lg"
                className="unified-button-primary group"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    IP Copiée !
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                    Copier l&apos;IP
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="unified-button-secondary"
                onClick={() =>
                  (window.location.href = `minecraft://${serverIP}`)
                }
              >
                <Zap className="mr-2 h-4 w-4" />
                Lancer Minecraft
              </Button>
            </div>

            {/* Version Info */}
            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Version supportée : Java Edition 1.20+
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
