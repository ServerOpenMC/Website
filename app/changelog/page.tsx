"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from "react-markdown";
import {
  Calendar,
  GitCommit,
  Tag,
  ExternalLink,
  Clock,
  User,
  AlertCircle,
  RefreshCw,
  Link,
  GitPullRequest,
  GitCompare,
  Github,
} from "lucide-react";
import { GitHubApi } from "@/lib/github-cache";

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
}

interface Release {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  if (diffInSeconds < 3600)
    return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400)
    return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800)
    return `Il y a ${Math.floor(diffInSeconds / 86400)} ${
      Math.floor(diffInSeconds / 86400) > 1 ? "jours" : "jour"
    }`;
  return formatDate(dateString);
};

const truncateMessage = (message: string, maxLength: number = 100) => {
  const firstLine = message.split("\n")[0];
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.substring(0, maxLength - 3) + "...";
};

const cleanReleaseBody = (body: string) => {
  if (!body) return body;

  return body
    .replace(
      /<!-- Release notes generated using configuration in \.github\/release\.yml at \w+ -->\s*/g,
      ""
    )
    .replace(/<!-- .* -->\s*/g, "")
    .trim();
};

const convertUrlsToMarkdown = (text: string) => {
  if (!text) return text;

  let processedText = text.replace(
    /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(pull|compare)\/([^\s\)]+)/g,
    (match, owner, repo, type, id) => {
      let linkText = "";
      if (type === "pull") {
        const prNumber = id.split(/[\/\?#]/)[0];
        linkText = `PR #${prNumber}`;
      } else if (type === "compare") {
        linkText = "Changelog complet";
      }
      return `[${linkText}](${match})`;
    }
  );

  processedText = processedText.replace(
    /@([a-zA-Z0-9_-]+)(?!\]\()/g,
    (match, username) => {
      return `[@${username}](https://github.com/${username})`;
    }
  );

  return processedText;
};

const getLinkIcon = (href: string) => {
  if (href.includes("github.com") && href.includes("/pull/")) {
    return <GitPullRequest className="w-2.5 h-2.5 flex-shrink-0" />;
  } else if (href.includes("github.com") && href.includes("/compare/")) {
    return <GitCompare className="w-2.5 h-2.5 flex-shrink-0" />;
  } else if (
    (href.includes("github.com/") && !href.includes("/")) ||
    href.match(/github\.com\/[^\/]+$/)
  ) {
    return <User className="w-2.5 h-2.5 flex-shrink-0" />;
  }
  return <Link className="w-2.5 h-2.5 flex-shrink-0" />;
};

const PullRequestLink = ({
  href,
  prNumber,
}: {
  href: string;
  prNumber: string;
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      asChild
      className="h-[1.75em] text-xs px-1.5 py-1 mx-0.5 inline-flex items-center gap-0.5 hover:bg-primary/10 hover:border-primary/50 transition-colors align-middle font-normal border-muted-foreground/30"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline text-muted-foreground hover:text-foreground flex items-center gap-0.5 leading-none"
      >
        <Github className="w-2.5 h-2.5 flex-shrink-0" />
        <span className="text-[9px] opacity-50">/</span>
        <span className="text-[10px] font-medium">PR #{prNumber}</span>
      </a>
    </Button>
  );
};

const UserMention = ({
  username,
  href,
}: {
  username: string;
  href: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className="h-auto p-0 text-muted-foreground hover:text-foreground underline-offset-4 hover:underline font-normal"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            @{username}
          </a>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" style={{ zIndex: 99999999, position: 'fixed' }}>
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src={`https://github.com/${username}.png`} />
            <AvatarFallback>
              {username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@{username}</h4>
            <p className="text-sm text-muted-foreground">
              Contributeur OpenMC – développeur du plugin.
            </p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Github className="w-3 h-3" />
              <span>GitHub Profile</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default function ChangelogPage() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoadingCommits, setIsLoadingCommits] = useState(true);
  const [isLoadingReleases, setIsLoadingReleases] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommits = async () => {
    try {
      setIsLoadingCommits(true);
      setError(null);

      const data = await GitHubApi.getCommits("ServerOpenMC", "PluginV2", 20);
      setCommits(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des commits:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoadingCommits(false);
    }
  };

  const fetchReleases = async () => {
    try {
      setIsLoadingReleases(true);

      const data = await GitHubApi.getReleases("ServerOpenMC", "PluginV2", 10);
      const filteredReleases = data.filter(
        (release: Release) => !release.draft
      );

      setReleases(filteredReleases);
    } catch (error) {
      console.error("Erreur lors de la récupération des releases:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoadingReleases(false);
    }
  };

  useEffect(() => {
    fetchCommits();
    fetchReleases();
  }, []);

  const handleRetry = () => {
    fetchCommits();
    fetchReleases();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-destructive/10 border-destructive/20">
              <CardHeader className="text-center">
                <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <CardTitle className="text-2xl text-destructive">
                  Erreur de chargement
                </CardTitle>
                <CardDescription className="text-destructive/80">
                  {error}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Changelog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Suivez l&apos;évolution du plugin OpenMC avec les dernières mises à
            jour, corrections et nouvelles fonctionnalités.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/50 border-border backdrop-blur-sm h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                  <Tag className="w-6 h-6" />
                  Versions officielles
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Les dernières versions stables du plugin
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingReleases ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-3 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : releases.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune version disponible
                  </p>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {releases.map((release, index) => (
                        <motion.div
                          key={release.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-card/80 border-border/50 hover:bg-card transition-colors">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      release.prerelease
                                        ? "secondary"
                                        : "default"
                                    }
                                    className={
                                      release.prerelease
                                        ? "bg-secondary text-secondary-foreground"
                                        : "bg-primary text-primary-foreground"
                                    }
                                  >
                                    {release.tag_name}
                                  </Badge>
                                  {release.prerelease && (
                                    <Badge
                                      variant="outline"
                                      className="text-muted-foreground border-border"
                                    >
                                      Pre-release
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {formatRelativeTime(release.published_at)}
                                </span>
                              </div>
                              <CardTitle className="text-lg text-foreground">
                                {release.name || release.tag_name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {release.author.login}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(release.published_at)}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-primary/50 text-primary hover:bg-primary/10"
                                    >
                                      Voir les détails
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent 
                                    className="max-w-8xl max-h-[80vh] w-[100vw] bg-card border-border" 
                                    style={{ 
                                      zIndex: 9999999,
                                      position: 'fixed',
                                    }}
                                  >
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2 text-primary">
                                        <Tag className="w-5 h-5" />
                                        {release.name || release.tag_name}
                                      </DialogTitle>
                                      <DialogDescription className="text-muted-foreground">
                                        Publié le{" "}
                                        {formatDate(release.published_at)} par{" "}
                                        {release.author.login}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <ScrollArea className="max-h-[60vh]">
                                      <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-primary prose-links:text-primary prose-strong:text-foreground prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded prose-blockquote:border-l-primary prose-hr:border-border">
                                        <ReactMarkdown
                                          components={{
                                            h1: ({ children }) => (
                                              <h1 className="text-2xl font-bold text-primary mb-4 mt-6">
                                                {children}
                                              </h1>
                                            ),
                                            h2: ({ children }) => (
                                              <h2 className="text-xl font-semibold text-primary mb-3 mt-5">
                                                {children}
                                              </h2>
                                            ),
                                            h3: ({ children }) => (
                                              <h3 className="text-lg font-medium text-primary mb-2 mt-4">
                                                {children}
                                              </h3>
                                            ),
                                            p: ({ children }) => (
                                              <p className="text-foreground mb-3 leading-relaxed">
                                                {children}
                                              </p>
                                            ),
                                            ul: ({ children }) => (
                                              <ul className="list-disc list-inside mb-4 space-y-1 text-foreground">
                                                {children}
                                              </ul>
                                            ),
                                            ol: ({ children }) => (
                                              <ol className="list-decimal list-inside mb-4 space-y-1 text-foreground">
                                                {children}
                                              </ol>
                                            ),
                                            li: ({ children }) => (
                                              <li className="text-foreground">
                                                {children}
                                              </li>
                                            ),
                                            a: ({ href, children }) => {
                                              // Vérifier si c'est un profil GitHub
                                              const isGitHubProfile =
                                                href &&
                                                ((href.includes(
                                                  "github.com/"
                                                ) &&
                                                  !href.includes("/")) ||
                                                  href.match(
                                                    /github\.com\/[^\/]+$/
                                                  ));

                                              if (isGitHubProfile) {
                                                const username =
                                                  href.split("github.com/")[1];
                                                return (
                                                  <UserMention
                                                    username={username}
                                                    href={href}
                                                  />
                                                );
                                              }

                                              // Vérifier si c'est une PR GitHub
                                              const isPullRequest =
                                                href &&
                                                href.includes("github.com") &&
                                                href.includes("/pull/");
                                              if (isPullRequest) {
                                                const prNumber = href
                                                  .split("/pull/")[1]
                                                  ?.split(/[\/\?#]/)[0];
                                                return (
                                                  <PullRequestLink
                                                    href={href}
                                                    prNumber={prNumber || "?"}
                                                  />
                                                );
                                              }

                                              // Pour les autres liens
                                              return (
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  asChild
                                                  className="h-[2em] text-xs px-2 mx-0.5 inline-flex items-center gap-0.5 hover:bg-primary/10 hover:border-primary/50 transition-colors align-middle font-normal border-muted-foreground/30"
                                                >
                                                  <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="no-underline text-muted-foreground hover:text-foreground leading-none"
                                                  >
                                                    {getLinkIcon(href || "")}
                                                    <span className="max-w-[70px] truncate text-[10px] font-medium">
                                                      {children}
                                                    </span>
                                                  </a>
                                                </Button>
                                              );
                                            },
                                            code: ({ children, className }) => (
                                              <code
                                                className={`text-primary bg-muted px-1 py-0.5 rounded text-sm font-mono ${
                                                  className || ""
                                                }`}
                                              >
                                                {children}
                                              </code>
                                            ),
                                            blockquote: ({ children }) => (
                                              <blockquote className="border-l-4 border-primary pl-4 my-4 text-muted-foreground italic">
                                                {children}
                                              </blockquote>
                                            ),
                                            hr: () => (
                                              <hr className="border-border my-6" />
                                            ),
                                          }}
                                        >
                                          {convertUrlsToMarkdown(
                                            cleanReleaseBody(release.body)
                                          ) || "Aucune description disponible."}
                                        </ReactMarkdown>
                                      </div>
                                    </ScrollArea>
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  <a
                                    href={release.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card/50 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                  <GitCommit className="w-6 h-6" />
                  Commits récents
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Les dernières modifications du code source
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCommits ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-muted rounded-full"></div>
                          <div className="h-4 bg-muted rounded flex-1"></div>
                        </div>
                        <div className="h-3 bg-muted rounded w-2/3 ml-11"></div>
                      </div>
                    ))}
                  </div>
                ) : commits.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun commit disponible
                  </p>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {commits.map((commit, index) => (
                        <motion.div
                          key={commit.sha}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group"
                        >
                          <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-shrink-0">
                              {commit.author ? (
                                <Image
                                  src={commit.author.avatar_url}
                                  alt={commit.author.login}
                                  width={32}
                                  height={32}
                                  className="w-8 h-8 rounded-full"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = "none";
                                    target.nextElementSibling?.classList.remove(
                                      "hidden"
                                    );
                                  }}
                                />
                              ) : null}
                              <div
                                className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${
                                  commit.author ? "hidden" : ""
                                }`}
                              >
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                  {commit.author?.login ||
                                    commit.commit.author.name}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatRelativeTime(
                                    commit.commit.author.date
                                  )}
                                </div>
                              </div>

                              <p className="text-sm text-muted-foreground mb-2">
                                {truncateMessage(commit.commit.message)}
                              </p>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground border-border font-mono text-[10px] px-1 py-0"
                                >
                                  {commit.sha.substring(0, 7)}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  asChild
                                  className="h-6 px-2 text-muted-foreground hover:text-foreground"
                                >
                                  <a
                                    href={commit.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </div>

                          {index < commits.length - 1 && (
                            <Separator className="my-2 bg-border" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 pb-8"
        >
          <Card className="bg-card/30 border-border backdrop-blur-sm">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-2">
                Données récupérées depuis le repository{" "}
                <a
                  href="https://github.com/ServerOpenMC/PluginV2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  ServerOpenMC/PluginV2
                </a>
              </p>
              <p className="text-sm text-muted-foreground/70">
                Mis à jour automatiquement • Développé avec Next.js et shadcn/ui
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
