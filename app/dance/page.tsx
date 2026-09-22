"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BackgroundAudio from "./backgroundaudio";
import { GitHubApi, type GitHubContributor } from "@/lib/github-cache";

export default function Dance() {
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllContributors() {
      try {
        const repos = ["PluginV2", "Plugin", "Website"];
        const requests = repos.map((repo) =>
          GitHubApi.getContributors("ServerOpenMC", repo).catch(() => [])
        );

        const rawResults = await Promise.all(requests);
        const allContributors = rawResults.flat();
        const uniqueContributors = Array.from(
          new Map(allContributors.map((user) => [user.id, user])).values()
        );

        setContributors(uniqueContributors);
      } catch (error) {
        console.error("Erreur lors de la récupération des contributeurs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllContributors();
  }, []);

  return (
    <main className="pt-28 pb-12 px-4 text-center min-h-screen bg-background text-foreground flex flex-col items-center justify-center overflow-hidden">
      <h1 className="text-3xl font-bold text-primary mb-8">
        Les contributeurs dansent (easter egg sympa xD) !
      </h1>

      <BackgroundAudio onStateChange={setIsPlaying} />

      {loading ? (
        <p className="text-muted-foreground animate-pulse">Chargement des contributeurs...</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 max-w-4xl">
          {contributors.map((user, index) => {
            const delay = `${(index % 5) * 0.15}s`;

            return (
              <a
                key={user.id}
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group cursor-pointer"
              >
                <div
                  className={`relative w-20 h-20 transition-transform ${
                    isPlaying ? "animate-dance" : ""
                  }`}
                  style={{ animationDelay: delay }}
                >
                  <Image
                    src={user.avatar_url}
                    alt={user.login}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-primary object-cover"
                    unoptimized
                  />
                </div>
                <span className="text-xs mt-2 font-mono text-muted-foreground group-hover:text-primary transition-colors">
                  {user.login}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}