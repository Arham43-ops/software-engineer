
import { notFound } from 'next/navigation';
import { portfolioData } from '@/data/portfolio';
import { ProjectPageContent } from '@/components/projects/ProjectPageContent';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-07.antideploy.com';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<import('next').Metadata> {
    const { slug } = await params;
    const project = portfolioData.projects.find((item) => item.slug === slug);

    if (!project) {
        return {
            title: 'Project',
            robots: { index: false, follow: true },
        };
    }

    const url = `${siteUrl}/projects/${project.slug}`;

    return {
        title: project.title,
        description: project.description,
        keywords: [...project.techStack, project.category, 'software project', 'Full Stack development'],
        alternates: { canonical: url },
        openGraph: {
            type: 'website',
            url,
            title: project.title,
            description: project.description,
            images: project.image
                ? [{ url: project.image, alt: project.title }]
                : [{ url: '/opengraph-image', alt: 'Arham Topiwala — Full Stack Web Developer' }],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.description,
            images: project.image ? [project.image] : ['/opengraph-image'],
        },
    };
}

export async function generateStaticParams() {
    return portfolioData.projects.map((project) => ({
        slug: project.slug,
    }));
}

import { getProjectImages } from '@/app/actions/getProjectImages'; // Import server action

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = portfolioData.projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    const projectSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        '@id': `${siteUrl}/projects/${project.slug}#software`,
        name: project.title,
        description: project.description,
        url: `${siteUrl}/projects/${project.slug}`,
        programmingLanguage: project.techStack,
        author: {
            '@type': 'Person',
            name: 'Arham Topiwala',
            url: siteUrl,
        },
        dateCreated: project.startDate,
        ...(project.repoUrl ? { codeRepository: project.repoUrl } : {}),
        ...(project.category ? { applicationCategory: project.category } : {}),
    };

    // Fetch dynamic images from public/project folder
    const galleryImages = await getProjectImages(slug, project.title);

    // If dynamic images found, override the project data
    const updatedProject = {
        ...project,
        image: galleryImages.length > 0 ? galleryImages[0] : project.image, // First image as Hero
        galleryImages: galleryImages.length > 0 ? galleryImages : project.galleryImages // All images for gallery
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
            />
            <ProjectPageContent project={updatedProject} />
        </>
    );
}
