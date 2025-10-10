"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { GitHubApi } from "@/lib/github-cache";

interface ContributorStat {
  author: {
    login: string;
  };
  weeks: Array<{
    a: number;
    d: number;
  }>;
}

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  additions?: number;
  deletions?: number;
  netLines?: number;
}

export default function Contributors() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        setLoading(true);

        const data = await GitHubApi.getContributors(
          "ServerOpenMC",
          "PluginV2"
        );

        const contributorsWithStats = await Promise.all(
          data.slice(0, 12).map(async (contributor: Contributor) => {
            try {
              const statsData = await GitHubApi.getContributorStats(
                "ServerOpenMC",
                "PluginV2"
              );
              const contributorStats = statsData.find(
                (stat: ContributorStat) =>
                  stat.author.login === contributor.login
              );

              if (contributorStats) {
                const totalAdditions = contributorStats.weeks.reduce(
                  (sum: number, week: { a: number; d: number }) => sum + week.a,
                  0
                );
                const totalDeletions = contributorStats.weeks.reduce(
                  (sum: number, week: { a: number; d: number }) => sum + week.d,
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

        contributorsWithStats.sort((a: Contributor, b: Contributor) => {
          if (a.additions !== undefined && b.additions !== undefined) {
            return b.additions - a.additions;
          }
          return b.contributions - a.contributions;
        });

        setContributors(contributorsWithStats);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, []);

  if (loading) {
    return (
      <motion.section
        className="flex flex-col items-center justify-center py-16 w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Nos Contributeurs
        </motion.h2>

        <motion.p
          className="text-muted-foreground text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Chargement des contributeurs...
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full max-w-4xl">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center space-y-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.05,
                ease: "easeOut",
              }}
            >
              <div className="relative w-16 h-16 bg-gradient-to-br from-muted to-muted/60 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -skew-x-12" />
              </div>
              <div className="h-4 w-20 bg-gradient-to-r from-muted to-muted/60 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -skew-x-12" />
              </div>
              <div className="h-3 w-16 bg-gradient-to-r from-muted to-muted/60 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer transform -skew-x-12" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 flex items-center space-x-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span className="text-sm">Récupération des données GitHub</span>
        </motion.div>
      </motion.section>
    );
  }

  if (error) {
    return (
      <motion.section
        className="flex flex-col items-center justify-center py-16 w-full px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Nos Contributeurs
        </motion.h2>

        <motion.div
          className="flex flex-col items-center space-y-4 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-destructive font-medium">
            Impossible de charger les contributeurs
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <motion.button
            className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
            onClick={() => window.location.reload()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Réessayer
          </motion.button>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="flex flex-col items-center justify-center py-16 w-full max-w-5xl px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Nos Contributeurs
      </motion.h2>

      <motion.p
        className="text-muted-foreground text-center mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
      >
        Les développeurs qui contribuent au projet OpenMC
      </motion.p>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full max-w-4xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        {contributors.map((contributor, i) => (
          <motion.div
            key={contributor.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.1 + i * 0.05,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center group"
          >
            <Link
              href={contributor.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center transition-transform group-hover:scale-105"
            >
              <div className="relative w-16 h-16 mb-2">
                <Image
                  src={contributor.avatar_url}
                  alt={`${contributor.login} avatar`}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-colors"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${contributor.login}&background=random&color=fff&size=64`;
                  }}
                />
              </div>
              <p className="text-sm font-medium text-center group-hover:text-primary transition-colors">
                {contributor.login}
              </p>
              <p className="text-xs text-muted-foreground">
                {contributor.contributions} commits
              </p>
              {(contributor.additions || contributor.deletions) && (
                <p className="text-xs text-muted-foreground">
                  {contributor.netLines !== undefined && contributor.netLines >= 0 && "+"}
                  {contributor.netLines || 0} lignes
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-8"
      >
        <Link
          href="https://github.com/ServerOpenMC"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors font-medium text-sm flex items-center gap-1"
        >
          Voir tous les contributeurs sur GitHub
          <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </motion.section>
  );
}
