"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/public/branding/logoomc.webp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GitHubApi } from "@/lib/github-cache";

interface WebsiteContributorStat {
  author: {
    login: string;
  };
  weeks: Array<{
    a: number;
    d: number;
  }>;
}

interface WebsiteContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  additions?: number;
  deletions?: number;
  netLines?: number;
}

export default function Footer() {
  const [websiteContributors, setWebsiteContributors] = useState<
    WebsiteContributor[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState<number | string>('');

  useEffect(() => {
    const fetchWebsiteContributors = async () => {
      try {
        setLoading(true);

        const contributorsData = await GitHubApi.getContributors(
          "ServerOpenMC",
          "Website"
        );

        const contributorsWithStats = await Promise.all(
          contributorsData
            .slice(0, 8)
            .map(async (contributor: WebsiteContributor) => {
              try {
                const statsData = await GitHubApi.getContributorStats(
                  "ServerOpenMC",
                  "Website"
                );
                const contributorStats = statsData.find(
                  (stat: WebsiteContributorStat) =>
                    stat.author.login === contributor.login
                );

                if (contributorStats) {
                  const totalAdditions = contributorStats.weeks.reduce(
                    (sum: number, week: { a: number; d: number }) =>
                      sum + week.a,
                    0
                  );
                  const totalDeletions = contributorStats.weeks.reduce(
                    (sum: number, week: { a: number; d: number }) =>
                      sum + week.d,
                    0
                  );

                  return {
                    ...contributor,
                    additions: totalAdditions,
                    deletions: totalDeletions,
                    netLines: totalAdditions - totalDeletions,
                  };
                }
                return contributor;
              } catch {
                return contributor;
              }
            })
        );

        contributorsWithStats.sort(
          (a: WebsiteContributor, b: WebsiteContributor) => {
            if (a.additions !== undefined && b.additions !== undefined) {
              return b.additions - a.additions;
            }
            return b.contributions - a.contributions;
          }
        );

        setWebsiteContributors(contributorsWithStats);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteContributors();

    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-8 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={Logo}
                    alt="Logo OpenMC"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-bold text-lg">OpenMC</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Serveur Minecraft open-source innovant et collaboratif pour la
                communauté. Rejoignez-nous dans cette aventure !
              </p>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex -space-x-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-muted rounded-full animate-pulse ring-2 ring-background"
                      />
                    ))}
                  </div>
                ) : websiteContributors.length === 0 ? (
                  <p className="text-muted-foreground text-xs">
                    Aucun contributeur trouvé pour le repository Website
                  </p>
                ) : (
                  <TooltipProvider>
                    <div className="flex -space-x-2">
                      {websiteContributors.map((contributor, index) => (
                        <motion.div
                          key={contributor.id}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative group cursor-pointer">
                                <Avatar className="w-8 h-8 ring-2 ring-background hover:z-10 transition-all duration-200 hover:scale-110 hover:ring-primary/20">
                                  <AvatarImage
                                    src={contributor.avatar_url}
                                    alt={`@${contributor.login}`}
                                  />
                                  <AvatarFallback className="text-xs">
                                    {contributor.login
                                      .slice(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="bg-card border-border"
                            >
                              <div className="text-center p-2">
                                <p className="font-medium">
                                  @{contributor.login}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {contributor.contributions} commits
                                </p>
                                {contributor.netLines !== undefined && (
                                  <p className="text-xs text-muted-foreground">
                                    {contributor.netLines >= 0 ? "+" : ""}
                                    {contributor.netLines} lignes
                                  </p>
                                )}
                                <div className="flex justify-center mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Website
                                  </Badge>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </motion.div>
                      ))}
                    </div>
                  </TooltipProvider>
                )}

                {websiteContributors.length > 0 && (
                  <Link
                    href="https://github.com/ServerOpenMC/Website"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Voir tous les contributeurs du site web sur GitHub
                  </Link>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Liens rapides</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join"
                    className="hover:text-foreground transition-colors"
                  >
                    Rejoindre le serveur Minecraft
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="hover:text-foreground transition-colors"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://wiki.openmc.fr/"
                    target="_blank"
                    className="hover:text-foreground transition-colors"
                  >
                    Wiki
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Communauté</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="https://discord.com/invite/KA33gxE43G"
                    target="_blank"
                    className="hover:text-foreground transition-colors"
                  >
                    Discord
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/ServerOpenMC"
                    target="_blank"
                    className="hover:text-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/ServerOpenMC/PluginV2"
                    target="_blank"
                    className="hover:text-foreground transition-colors"
                  >
                    Plugin Principal
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              &copy; {year} OpenMC. Fait avec{" "}
              <Link href="/dance" className="hover:text-foreground transition-colors">
                <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              </Link>
              par la communauté.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Mentions légales
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Conditions d&apos;utilisation
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
