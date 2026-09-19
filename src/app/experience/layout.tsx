import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Experience & Education',
    description: 'Arham Topiwala\'s professional experience, education, engineering responsibilities, and technical background.',
    alternates: { canonical: '/experience' },
};

export default function ExperienceLayout({ children }: { children: React.ReactNode }) {
    return children;
}
