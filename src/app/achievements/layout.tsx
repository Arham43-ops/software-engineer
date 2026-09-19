import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Achievements & Certifications',
    description: 'View Arham Topiwala\'s certifications, awards, competitions, and professional achievements across software, AI, cybersecurity, and technology.',
    alternates: { canonical: '/achievements' },
};

export default function AchievementsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
