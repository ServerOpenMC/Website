import { ArrowRightIcon, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface DiscordSectionProps {
  title?: string;
  description?: string;
  discordUrl?: string;
  buttonText?: string;
  features?: string[];
  memberCount?: string;
  memberLabel?: string;
  communityTitle?: string;
  className?: string;
  showMemberCount?: boolean;
}

export default function DiscordSection({
  title = "Rejoignez notre Discord",
  description = "Connectez-vous avec la communauté OpenMC ! Discutez avec les autres joueurs, obtenez de l'aide, participez aux événements et restez informé des dernières actualités du serveur.",
  discordUrl = "https://discord.gg/H7DrUjHw7q",
  buttonText = "Rejoindre Discord",
  features = [
    "💬 Chat en temps réel avec la communauté",
    "🎮 Organisation d'événements et contests",
    "🛠️ Support technique et aide",
    "📢 Annonces et mises à jour du serveur",
  ],
  memberCount = "10000+",
  memberLabel = "Membres connectés",
  communityTitle = "Communauté Active",
  className = "",
  showMemberCount = true,
}: DiscordSectionProps) {
  return (
    <section className={`py-20 px-4 max-w-6xl mx-auto ${className}`}>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5865f2]/10 to-[#5865f2]/5 border border-[#5865f2]/20 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865f2]/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start flex-wrap">
              <MessageCircle className="w-8 h-8 text-[#5865f2]" />
              <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">{description}</p>
            <div className="space-y-3 mb-8 w-full flex flex-col items-center lg:items-start">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-[#5865f2] hover:bg-[#4752c4] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  {buttonText}
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          {showMemberCount && (
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#5865f2]/20 rounded-2xl blur-2xl scale-110"></div>
                <div className="relative bg-[#5865f2]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#5865f2]/20">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-[#5865f2] rounded-2xl flex items-center justify-center">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {communityTitle}
                    </h3>
                    <p className="text-3xl font-bold text-[#5865f2] mb-2">
                      {memberCount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {memberLabel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
