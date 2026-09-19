import type { Metadata } from 'next';
import { portfolioData } from '@/data/portfolio';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-07.antideploy.com';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    const post = portfolioData.blogs.find((item) => item.slug === slug);

    if (!post) {
        return {
            title: 'Blog Post',
            robots: { index: false, follow: true },
        };
    }

    const url = `${siteUrl}/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.tags,
        authors: [{ name: post.author.name }],
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            url,
            title: post.title,
            description: post.excerpt,
            publishedTime: post.date,
            authors: [post.author.name],
            section: post.category,
            tags: post.tags,
            images: [
                {
                    url: post.image,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function BlogPostLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = portfolioData.blogs.find((item) => item.slug === slug);

    const articleSchema = post
        ? {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              '@id': `${siteUrl}/blog/${post.slug}#article`,
              headline: post.title,
              description: post.excerpt,
              image: [`${siteUrl}${post.image}`],
              datePublished: post.date,
              dateModified: post.date,
              author: {
                  '@type': 'Person',
                  name: post.author.name,
                  url: siteUrl,
              },
              publisher: {
                  '@type': 'Person',
                  name: 'Arham Topiwala',
                  url: siteUrl,
              },
              mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `${siteUrl}/blog/${post.slug}`,
              },
              keywords: post.tags.join(', '),
              articleSection: post.category,
              timeRequired: post.readTime,
          }
        : null;

    return (
        <>
            {articleSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
                />
            )}
            {children}
        </>
    );
}
