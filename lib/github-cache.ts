/**
 * Système de cache pour les appels API GitHub
 * Utilise localStorage avec expiration automatique
 */

interface CacheData<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // en millisecondes
}

export interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  html_url: string;
}

interface GitHubCommit {
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

interface GitHubRelease {
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

interface GitHubContributorStat {
  author: {
    login: string;
  };
  weeks: Array<{
    a: number;
    d: number;
  }>;
}

export class GitHubApiCache {
  private static readonly PREFIX = "github_cache_";

  /**
   * Sauvegarde des données dans le cache
   * @param key - Clé unique pour identifier les données
   * @param data - Données à sauvegarder
   * @param expiresIn - Durée de validité en millisecondes (défaut: 30 minutes)
   */
  static set<T>(
    key: string,
    data: T,
    expiresIn: number = 30 * 60 * 1000
  ): void {
    try {
      const cacheData: CacheData<T> = {
        data,
        timestamp: Date.now(),
        expiresIn,
      };

      localStorage.setItem(`${this.PREFIX}${key}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Erreur lors de la sauvegarde en cache:", error);
    }
  }

  /**
   * Récupère des données du cache
   * @param key - Clé des données à récupérer
   * @returns Les données si valides, null sinon
   */
  static get<T>(key: string): T | null {
    try {
      const cachedItem = localStorage.getItem(`${this.PREFIX}${key}`);

      if (!cachedItem) {
        return null;
      }

      const cacheData: CacheData<T> = JSON.parse(cachedItem);
      const now = Date.now();

      if (now - cacheData.timestamp > cacheData.expiresIn) {
        this.remove(key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.warn("Erreur lors de la lecture du cache:", error);
      this.remove(key);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(`${this.PREFIX}${key}`);
    } catch (error) {
      console.warn("Erreur lors de la suppression du cache:", error);
    }
  }

  static cleanup(): void {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.PREFIX)
      );

      keys.forEach((key) => {
        const cachedItem = localStorage.getItem(key);
        if (cachedItem) {
          try {
            const cacheData: CacheData<unknown> = JSON.parse(cachedItem);
            const now = Date.now();

            if (now - cacheData.timestamp > cacheData.expiresIn) {
              localStorage.removeItem(key);
            }
          } catch {
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn("Erreur lors du nettoyage du cache:", error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage).filter((key) =>
        key.startsWith(this.PREFIX)
      );

      keys.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.warn("Erreur lors du vidage du cache:", error);
    }
  }

  static has(key: string): boolean {
    return this.get(key) !== null;
  }
}

export class GitHubApi {
  private static readonly CACHE_DURATION = {
    CONTRIBUTORS: 15 * 60 * 1000, // 15 minutes
    REPOSITORY: 30 * 60 * 1000, // 30 minutes
    STATS: 10 * 60 * 1000, // 10 minutes
    COMMITS: 5 * 60 * 1000, // 5 minutes
    RELEASES: 20 * 60 * 1000, // 20 minutes
  };

  private static async fetchWithCache<T>(
    url: string,
    cacheKey: string,
    cacheDuration: number,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const cachedData = GitHubApiCache.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const defaultHeaders = {
      Accept: "application/vnd.github.v3+json",
      ...headers,
    };

    const response = await fetch(url, { headers: defaultHeaders });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error(
          "Limite de taux API GitHub atteinte. Les données en cache seront utilisées."
        );
      }
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    GitHubApiCache.set(cacheKey, data, cacheDuration);

    return data;
  }

  static async getContributors(
    owner: string,
    repo: string
  ): Promise<GitHubContributor[]> {
    const cacheKey = `contributors_${owner}_${repo}`;
    return this.fetchWithCache<GitHubContributor[]>(
      `https://api.github.com/repos/${owner}/${repo}/contributors`,
      cacheKey,
      this.CACHE_DURATION.CONTRIBUTORS
    );
  }

  static async getRepository(
    owner: string,
    repo: string
  ): Promise<GitHubRepository> {
    const cacheKey = `repository_${owner}_${repo}`;
    return this.fetchWithCache<GitHubRepository>(
      `https://api.github.com/repos/${owner}/${repo}`,
      cacheKey,
      this.CACHE_DURATION.REPOSITORY
    );
  }

  static async getContributorStats(
    owner: string,
    repo: string
  ): Promise<GitHubContributorStat[]> {
    const cacheKey = `stats_${owner}_${repo}`;
    return this.fetchWithCache<GitHubContributorStat[]>(
      `https://api.github.com/repos/${owner}/${repo}/stats/contributors`,
      cacheKey,
      this.CACHE_DURATION.STATS
    );
  }

  static async getCommits(
    owner: string,
    repo: string,
    perPage: number = 20
  ): Promise<GitHubCommit[]> {
    const cacheKey = `commits_${owner}_${repo}_${perPage}`;
    return this.fetchWithCache<GitHubCommit[]>(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}`,
      cacheKey,
      this.CACHE_DURATION.COMMITS
    );
  }

  static async getReleases(
    owner: string,
    repo: string,
    perPage: number = 10
  ): Promise<GitHubRelease[]> {
    const cacheKey = `releases_${owner}_${repo}_${perPage}`;
    return this.fetchWithCache<GitHubRelease[]>(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${perPage}`,
      cacheKey,
      this.CACHE_DURATION.RELEASES
    );
  }

  static async getOrgRepositories(org: string): Promise<GitHubRepository[]> {
    const cacheKey = `org_repos_${org}`;
    return this.fetchWithCache<GitHubRepository[]>(
      `https://api.github.com/orgs/${org}/repos`,
      cacheKey,
      this.CACHE_DURATION.REPOSITORY
    );
  }
}

if (typeof window !== "undefined") {
  GitHubApiCache.cleanup();
}
