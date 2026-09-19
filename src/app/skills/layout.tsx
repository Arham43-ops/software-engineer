import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Skills & Tools',
    description: 'Explore Arham Topiwala\'s technical skills, programming languages, frameworks, databases, tools, and engineering capabilities.',
    alternates: { canonical: '/skills' },
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
