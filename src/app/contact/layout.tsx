import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Contact Arham Topiwala for Full Stack Web Development roles, software engineering opportunities, collaborations, and technical projects.',
    alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
