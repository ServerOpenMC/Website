"use client";

import { Check, Copy, Server, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

export default function ServerConnection() {
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
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20 shadow-lg">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Server className="h-6 w-6 text-primary" />
          <h3 className="text-xl md:text-2xl font-bold text-foreground">
            Connexion Rapide
          </h3>
        </div>

        <p className="text-muted-foreground mb-8">
          Copiez l&apos;adresse IP et connectez-vous directement dans Minecraft
        </p>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center gap-2 bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full border border-green-500/20">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Serveur en ligne</span>
          </div>
        </div>

        <div className="max-w-lg mx-auto mb-8">
          <div className="bg-background/80 backdrop-blur-sm border border-border rounded-xl p-5 shadow-inner">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Adresse IP
                </p>
                <p className="font-mono text-lg md:text-xl font-bold text-primary">
                  {serverIP}
                </p>
              </div>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="shrink-0 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
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
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            onClick={handleCopy}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
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
            className="border-primary/30 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
            asChild
          >
            <Link
              href="minecraft://play.openmc.fr"
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Lancer Minecraft
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              Version supportée : Java Edition 1.20+
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
