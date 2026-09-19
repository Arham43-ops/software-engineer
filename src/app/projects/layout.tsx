import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Projects',
    description: 'Explore Arham Topiwala\'s software projects across Full Stack Web Development, Django, React, Next.js, Android, AI, cybersecurity, and FinTech.',
    alternates: { canonical: '/projects' },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
