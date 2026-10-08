import { NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'Arham43-ops';
const REPO = 'Certificates';
const BRANCH = 'main';

interface GitTreeItem {
  path: string;
  type: 'blob' | 'tree';
}

interface GitHubRepository {
  pushed_at: string | null;
}

interface CertificateRecord {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  credentialUrl: string;
  credentialId: string;
  tags: string[];
  type: string;
  category: 'certification' | 'award' | 'competition';
}

const cleanTitle = (value: string) => {
  return value
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const encodeGitHubPath = (value: string) =>
  value.split('/').map((part) => encodeURIComponent(part)).join('/');

const issuerFromFolder = (folder: string) => {
  const normalized = folder.toLowerCase();
  if (normalized.includes('coursera')) return 'Coursera';
  if (normalized.includes('hackerrank')) return 'HackerRank';
  if (normalized.includes('icat')) return 'ICAT';
  if (normalized.includes('oracle')) return 'Oracle';
  if (normalized.includes('ibm')) return 'IBM';
  return folder.replace(/[_-]+/g, ' ').trim() || 'Certificate';
};

const categoryFromFolder = (folder: string): CertificateRecord['category'] => {
  const normalized = folder.toLowerCase();
  if (normalized.includes('competition')) return 'competition';
  if (normalized.includes('award') || normalized.includes('recognition') || normalized.includes('internship')) return 'award';
  return 'certification';
};

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2026-03-10',
    },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function GET() {
  try {
    const [tree, repository] = await Promise.all([
      githubFetch<{ tree: GitTreeItem[]; truncated?: boolean }>(
        `${GITHUB_API}/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`,
      ),
      githubFetch<GitHubRepository>(`${GITHUB_API}/repos/${OWNER}/${REPO}`),
    ]);

    const files = tree.tree.filter(
      (item) => item.type === 'blob' && /\.pdf$/i.test(item.path),
    );

    const imagePaths = new Set(
      tree.tree
        .filter((item) => item.type === 'blob' && /\.(png|jpe?g|webp)$/i.test(item.path))
        .map((item) => item.path.replace(/\.(png|jpe?g|webp)$/i, '').toLowerCase()),
    );

    const fallbackDate = repository.pushed_at || new Date().toISOString();

    const certificates: CertificateRecord[] = files.map((file) => {
      const encodedPath = encodeGitHubPath(file.path);
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodedPath}`;
      const folder = file.path.includes('/') ? file.path.split('/')[0] : 'Certificates';
      const basePath = file.path.replace(/\.pdf$/i, '').toLowerCase();
      const matchingImage = [...imagePaths].find((imagePath) => imagePath === basePath);
      const imageUrl = matchingImage
        ? `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(
            file.path.replace(/\.pdf$/i, matchingImage.endsWith('.webp') ? '.webp' : matchingImage.endsWith('.jpg') ? '.jpg' : matchingImage.endsWith('.jpeg') ? '.jpeg' : '.png'),
          )}`
        : rawUrl;

      const title = cleanTitle(file.path.split('/').pop() || 'Certificate');
      const issuer = issuerFromFolder(folder);
      const category = categoryFromFolder(folder);

      return {
        id: `github-cert-${file.path.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        title,
        issuer,
        date: fallbackDate,
        description: `${title} — hosted in the ${folder} collection of the CERTIFICATES repository.`,
        image: imageUrl,
        credentialUrl: rawUrl,
        credentialId: file.path,
        tags: [issuer, folder],
        type: category === 'award' ? 'Internship / Recognition' : category === 'competition' ? 'Competition' : 'Certification',
        category,
      };
    });

    certificates.sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json(
      {
        source: `https://github.com/${OWNER}/${REPO}`,
        branch: BRANCH,
        count: certificates.length,
        truncated: Boolean(tree.truncated),
        certificates,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
        },
      },
    );
  } catch (error) {
    console.error('Certificate repository sync failed:', error);
    return NextResponse.json(
      { error: 'Unable to load certificates from GitHub.' },
      { status: 502 },
    );
  }
}
