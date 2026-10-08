import { NextRequest, NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';
const OWNER = 'Arham43-ops';
const REPO = 'Certificates';
const BRANCH = 'main';

interface GitTreeItem { path: string; type: 'blob' | 'tree'; }
interface GitHubRepository { pushed_at: string | null; }
interface CertificateRecord {
  id: string; title: string; issuer: string; date: string; description: string;
  image: string; credentialUrl: string; credentialId: string; tags: string[];
  type: string; category: 'certification' | 'award' | 'competition';
}

const cleanTitle = (value: string) => value.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
const encodeGitHubPath = (value: string) => value.split('/').map((part) => encodeURIComponent(part)).join('/');
const encodeQueryPath = (value: string) => encodeURIComponent(value);

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
    headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`GitHub API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

async function proxyCertificate(path: string) {
  if (!path || path.startsWith('/') || path.includes('..') || !/\.pdf$/i.test(path)) {
    return NextResponse.json({ error: 'Invalid certificate path.' }, { status: 400 });
  }

  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(path)}`;
  const response = await fetch(rawUrl, {
    headers: { Accept: 'application/pdf,*/*' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Certificate file not found.' }, { status: response.status });
  }

  const contentType = response.headers.get('content-type') || 'application/pdf';
  const contentLength = response.headers.get('content-length');
  const headers = new Headers({
    'Content-Type': contentType.includes('pdf') ? 'application/pdf' : 'application/pdf',
    'Content-Disposition': 'inline',
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    'X-Content-Type-Options': 'nosniff',
  });
  if (contentLength) headers.set('Content-Length', contentLength);

  return new NextResponse(await response.arrayBuffer(), { status: 200, headers });
}

export async function GET(request: NextRequest) {
  try {
    const requestedPath = request.nextUrl.searchParams.get('path');
    if (requestedPath) return proxyCertificate(requestedPath);

    const [tree, repository] = await Promise.all([
      githubFetch<{ tree: GitTreeItem[]; truncated?: boolean }>(`${GITHUB_API}/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`),
      githubFetch<GitHubRepository>(`${GITHUB_API}/repos/${OWNER}/${REPO}`),
    ]);

    const files = tree.tree.filter((item) => item.type === 'blob' && /\.pdf$/i.test(item.path));
    const previewImages = new Map<string, string>();
    tree.tree
      .filter((item) => item.type === 'blob' && /\.(png|jpe?g|webp)$/i.test(item.path))
      .forEach((item) => previewImages.set(item.path.replace(/\.(png|jpe?g|webp)$/i, '').toLowerCase(), item.path));

    const fallbackDate = repository.pushed_at || new Date().toISOString();
    const certificates: CertificateRecord[] = files.map((file) => {
      const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(file.path)}`;
      const previewUrl = `/api/certificates?path=${encodeQueryPath(file.path)}`;
      const folder = file.path.includes('/') ? file.path.split('/')[0] : 'Certificates';
      const previewPath = previewImages.get(file.path.replace(/\.pdf$/i, '').toLowerCase());
      const imageUrl = previewPath
        ? `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(previewPath)}`
        : previewUrl;
      const title = cleanTitle(file.path.split('/').pop() || 'Certificate');
      const issuer = issuerFromFolder(folder);
      const category = categoryFromFolder(folder);

      return {
        id: `github-cert-${file.path.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
        title, issuer, date: fallbackDate,
        description: `${title} — hosted in the ${folder} collection of the CERTIFICATES repository.`,
        image: imageUrl, credentialUrl: previewUrl, credentialId: file.path,
        tags: [issuer, folder],
        type: category === 'award' ? 'Internship / Recognition' : category === 'competition' ? 'Competition' : 'Certification',
        category,
      };
    });

    certificates.sort((a, b) => a.title.localeCompare(b.title));
    return NextResponse.json(
      { source: `https://github.com/${OWNER}/${REPO}`, branch: BRANCH, count: certificates.length, truncated: Boolean(tree.truncated), certificates },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    );
  } catch (error) {
    console.error('Certificate repository sync failed:', error);
    return NextResponse.json({ error: 'Unable to load certificates from GitHub.' }, { status: 502 });
  }
}
