'use server';

import fs from 'fs';
import path from 'path';

export interface GalleryImage {
    src: string;
    filename: string;
}

const GALLERY_DETAILS: Record<string, { title: string; description: string }> = {
    'new-photo-1.jpeg': {
        title: 'Professional Portrait',
        description: 'Professional portrait for portfolio and personal branding.',
    },
    'new-photo-2.jpeg': {
        title: 'Poster Presentation — Unveiling the Dark Web',
        description: 'Poster presentation on the Dark Web ecosystem, challenges, and potential implications.',
    },
    'new-photo-3.jpeg': {
        title: 'LJ Innovation Village 2026 — Project Showcase',
        description: 'Showcasing Phisgaurd, an AI-powered cyber-hacking prevention helper, at LJ Innovation Village 2026.',
    },
    'new-photo-4.jpeg': {
        title: 'LJ Innovation Village 2026 — Live Demonstration',
        description: 'Presenting and discussing the Phisgaurd AI cyber-hacking prevention project with visitors.',
    },
    'new-photo-5.jpeg': {
        title: 'LJ Innovation Village 2026 — Team',
        description: 'Team moment during LJ Innovation Village 2026 and the project showcase.',
    },
    'new-photo-6.jpeg': {
        title: 'LJ Innovation Village 2026',
        description: 'Team showcase at LJ Innovation Village 2026, a festival for student innovation and entrepreneurship.',
    },
    'new-photo-7.jpeg': {
        title: 'LJ Innovation Village 2026 — Showcase',
        description: 'Team photo during the LJ Innovation Village 2026 innovation showcase.',
    },
    'learning-day-award.jpg': {
        title: 'Coursera Learning Day Celebration',
        description: 'Receiving recognition during the Coursera Learning Day Celebration at LJ University.',
    },
    'learning-day-group.jpg': {
        title: 'Coursera Learning Day — Recognition Ceremony',
        description: 'Group recognition ceremony at LJ University during the Coursera Learning Day Celebration.',
    },
};

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
    const publicDir = path.join(process.cwd(), 'public');
    const galleryDir = path.join(publicDir, 'gallery');

    try {
        if (!fs.existsSync(galleryDir)) {
            return [];
        }

        const files = fs.readdirSync(galleryDir);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        const newGalleryFiles = [
            'new-photo-1.jpeg',
            'new-photo-2.jpeg',
            'new-photo-3.jpeg',
            'new-photo-4.jpeg',
            'new-photo-5.jpeg',
            'new-photo-6.jpeg',
            'new-photo-7.jpeg',
            'learning-day-award.jpg',
            'learning-day-group.jpg',
        ];

        return newGalleryFiles
            .filter(file => files.includes(file))
            .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => ({
                src: `/gallery/${file}`,
                filename: GALLERY_DETAILS[file]?.title || file,
            }));
    } catch (error) {
        console.error('Error reading gallery directory:', error);
        return [];
    }
}
