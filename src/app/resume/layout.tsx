import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Resume',
    description: 'View Arham Topiwala\'s resume, technical experience, education, skills, and Full Stack Web Development background.',
    alternates: { canonical: '/resume' },
    robots: {
        index: true,
        follow: true,
    },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
    return children;
}
