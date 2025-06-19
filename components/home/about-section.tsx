"use client";

import { ArrowRightIcon, Heart, Shield, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AboutSection() {
  const router = useRouter();

  const features = [
    {
      icon: Shield,
      title: "Sécurisé & Stable",
      description:
        "Un serveur maintenu avec des règles claires et une modération active pour garantir une expérience agréable à tous.",
    },
    {
      icon: Zap,
      title: "Performances Optimales",
      description:
        "Une infrastructure moderne et optimisée pour offrir des performances exceptionnelles sans lag.",
    },
    {
      icon: Heart,
      title: "Communauté Active",
      description:
        "Une communauté bienveillante et active qui vous accompagne dans votre aventure sur le serveur.",
    },
  ];

  const gameFeatures = [
    "🏗️ Système de villes et claims",
    "🎯 Quêtes et événements réguliers",
    "🎁 LootBox et récompenses",
    "⚡ Dimensions custom et features uniques",
    "🛡️ Anti-grief et protection avancée",
    "🎮 Mini-jeux et contests communautaires",
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          Qu&apos;est-ce qu&apos;OpenMC ?
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          OpenMC est bien plus qu&apos;un simple serveur Minecraft. C&apos;est
          une communauté passionnée qui développe ensemble une expérience de jeu
          unique et innovante.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center relative p-6 rounded-2xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

        <div className="relative">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoignez l&apos;Aventure
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Que vous soyez un joueur passionné ou un développeur souhaitant
              contribuer, OpenMC vous accueille dans sa communauté. Découvrez
              tout ce qui vous attend !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 transition-all duration-300">
            {gameFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-background/50 rounded-lg p-3 backdrop-blur-sm ring-1 ring-border "
              >
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 text-base px-8"
              onClick={() => router.push("/join")}
            >
              Commencer à Jouer
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8"
              asChild
            >
              <a
                href="https://discord.gg/H7DrUjHw7q"
                target="_blank"
                rel="noopener noreferrer"
              >
                Rejoindre Discord
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
