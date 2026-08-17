const GITHUB_API = "https://api.github.com";
const REVALIDATE_SECONDS = 3600;

interface GithubRepoApiResponse {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  updated_at: string;
}

interface GithubUserApiResponse {
  public_repos: number;
}

export interface GithubRepoSummary {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  updatedAt: string;
}

export interface GithubActivity {
  username: string;
  publicRepos: number;
  recentRepos: GithubRepoSummary[];
}

/**
 * Proxy server-side a la API de GitHub. GITHUB_USERNAME/GITHUB_TOKEN son
 * opcionales (ver .env.example) — si no estan configuradas, devuelve null
 * en vez de fallar, para que Dashboard/Inicio se rendericen igualmente.
 */
export async function getGithubActivity(): Promise<GithubActivity | null> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return null;

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`${GITHUB_API}/users/${username}`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(`${GITHUB_API}/users/${username}/repos?sort=updated&per_page=5`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
      }),
    ]);

    if (!userResponse.ok || !reposResponse.ok) return null;

    const user = (await userResponse.json()) as GithubUserApiResponse;
    const repos = (await reposResponse.json()) as GithubRepoApiResponse[];

    return {
      username,
      publicRepos: user.public_repos ?? 0,
      recentRepos: repos.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description,
        language: repo.language,
        updatedAt: repo.updated_at,
      })),
    };
  } catch {
    return null;
  }
}
