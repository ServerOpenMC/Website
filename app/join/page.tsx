"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/branding/logoomc.webp";
import { HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

interface Player {
  name: string;
  uuid: string;
}

interface ServerStatus {
  online: boolean;
  players: {
    online: number;
    max: number;
    list: string[];
    uuid?: { [key: string]: string };
  };
  version: string;
  description: string;
}

export default function JoinPage() {
  const [serverStatus, setServerStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");
  const [serverData, setServerData] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        const response = await fetch(
          `https://api.mcsrvstat.us/2/beta.openmc.fr`
        );
        const data = await response.json();

        if (data.online) {
          setServerStatus("online");
          setServerData(data);
        } else {
          setServerStatus("offline");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du statut du serveur:",
          error
        );
        setServerStatus("offline");
      } finally {
        setLoading(false);
      }
    };

    fetchServerStatus();

    const interval = setInterval(fetchServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText("beta.openmc.fr").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getPlayerCount = () => {
    if (!serverData) return "-";
    return `${serverData.players.online}/${serverData.players.max}`;
  };

  const getServerVersion = () => {
    if (!serverData || !serverData.version) return "Version: -";
    return `Version: ${serverData.version}`;
  };

  const getOnlinePlayers = () => {
    if (!serverData || !serverData.players.list) {
      return [];
    }

    const playerNames = serverData.players.list;
    const playerUuids = serverData.players.uuid || {};

    const players = playerNames.map((name) => ({
      name: name,
      uuid: playerUuids[name] || "undefined",
    }));

    return players;
  };

  const getPlayerHead = (player: Player) => {
    if (!player.uuid || player.uuid === "undefined") {
      return "https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=80&overlay";
    }
    return `https://crafatar.com/avatars/${player.uuid}?size=80&overlay`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Image
              src={Logo}
              alt="Logo du serveur"
              width={120}
              height={120}
              className="mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Rejoindre OpenMC
            </h1>
            <p className="text-xl text-muted-foreground">
              Connectez-vous à notre serveur Minecraft open-source
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Adresse du serveur</h2>
              <div className="bg-background rounded-lg p-4 font-mono text-lg mb-4 flex items-center justify-between">
                <span>beta.openmc.fr</span>
                <button
                  onClick={copyIP}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded text-sm transition-colors"
                >
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Copiez cette adresse dans votre client Minecraft
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border shadow-sm">
              <h3 className="text-2xl font-bold mb-4">Statut du serveur</h3>
              <div className="flex items-center mb-4">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    serverStatus === "online"
                      ? "bg-green-500"
                      : serverStatus === "offline"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                />
                <span className="font-medium">
                  {loading
                    ? "Vérification..."
                    : serverStatus === "online"
                    ? "En ligne"
                    : serverStatus === "offline"
                    ? "Hors ligne"
                    : "Vérification..."}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Joueurs connectés:
                  </span>
                  <span className="font-medium">{getPlayerCount()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">
                    {getServerVersion().replace("Version: ", "")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">
              Comment rejoindre ?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Ouvrez Minecraft",
                  desc: "Lancez votre client Minecraft (Java Edition)",
                },
                {
                  step: 2,
                  title: 'Cliquez sur "Multijoueur"',
                  desc: 'Dans le menu principal, sélectionnez "Multijoueur"',
                },
                {
                  step: 3,
                  title: "Ajoutez le serveur",
                  desc: 'Cliquez sur "Ajouter un serveur" et collez l\'adresse',
                },
                {
                  step: 4,
                  title: "Connectez-vous !",
                  desc: "Double-cliquez sur le serveur pour vous connecter",
                },
              ].map((item) => (
                <Card
                  key={item.step}
                  className="bg-card rounded-xl border shadow-sm"
                >
                  <CardContent className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 flex-shrink-0 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold text-base leading-tight">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center mb-8">
              Qui est en ligne ?
            </h3>
            <div className="bg-card rounded-xl p-6 border shadow-sm">
              {(() => {
                const onlinePlayers = getOnlinePlayers();
                if (loading) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Vérification du statut du serveur...
                      </p>
                    </div>
                  );
                } else if (onlinePlayers.length > 0) {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {onlinePlayers.map((player, index) => (
                        <div
                          key={`${player.name}-${index}`}
                          className="flex flex-col items-center p-3 rounded-lg transition-colors"
                        >
                          <Image
                            src={getPlayerHead(player)}
                            alt={`Tête de ${player.name}`}
                            title={player.name}
                            width={64}
                            height={64}
                            className="rounded-lg mb-2"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=80&overlay";
                            }}
                          />
                          <span className="text-sm font-medium text-center">
                            {player.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Personne n&apos;est connecté pour le moment.
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="https://discord.com/invite/H7DrUjHw7q" target="_blank">
              <Button variant={"discord"}>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Rejoindre Discord
              </Button>
            </Link>
            <Link href="/">
              <Button variant={"outline"}>
                <HomeIcon className="w-5 h-5 mr-2" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
