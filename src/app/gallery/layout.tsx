import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gallery',
    description: 'Portfolio gallery featuring Arham Topiwala\'s professional work, projects, events, and technical activities.',
    alternates: { canonical: '/gallery' },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
