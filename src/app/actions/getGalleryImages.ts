'use server';

import fs from 'fs';
import path from 'path';

export interface GalleryImage {
    src: string;
    filename: string;
}

export async function getAllGalleryImages(): Promise<GalleryImage[]> {
    const publicDir = path.join(process.cwd(), 'public');
    const galleryDir = path.join(publicDir, 'gallery');

    try {
        if (!fs.existsSync(galleryDir)) {
            return [];
        }

        const files = fs.readdirSync(galleryDir);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        // Use the seven newly uploaded portfolio photos as the active gallery.
        const newGalleryFiles = [
            'new-photo-1.jpeg',
            'new-photo-2.jpeg',
            'new-photo-3.jpeg',
            'new-photo-4.jpeg',
            'new-photo-5.jpeg',
            'new-photo-6.jpeg',
            'new-photo-7.jpeg',
        ];

        const images = newGalleryFiles
            .filter(file => files.includes(file))
            .filter(file => imageExtensions.includes(path.extname(file).toLowerCase()))
            .map(file => ({
                src: `/gallery/${file}`,
                filename: file,
            }));

        return images;
    } catch (error) {
        console.error('Error reading gallery directory:', error);
        return [];
    }
}
