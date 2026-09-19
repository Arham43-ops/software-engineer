import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Read Arham Topiwala\'s technical writing on web development, Next.js, performance engineering, AI, cybersecurity, Android, Django, and software architecture.',
    alternates: { canonical: '/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return children;
}
