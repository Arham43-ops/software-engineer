'use server';

import { readdir } from 'fs/promises';
import path from 'path';

let projectFilesPromise: Promise<Set<string>> | null = null;

async function getProjectFiles(): Promise<Set<string>> {
    if (!projectFilesPromise) {
        const projectDir = path.join(process.cwd(), 'public', 'project');
        projectFilesPromise = readdir(projectDir)
            .then((files) => new Set(files))
            .catch(() => new Set<string>());
    }

    return projectFilesPromise;
}

export async function getProjectImages(slug: string, title?: string): Promise<string[]> {
    const files = await getProjectFiles();
    const sanitizedSlug = slug.replace(/-/g, '');
    const sanitizedTitle = title ? title.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const searchBases = sanitizedTitle ? [sanitizedTitle, sanitizedSlug] : [sanitizedSlug];
    const uniqueBases = [...new Set(searchBases)];
    const validImages: string[] = [];
    const extensions = ['webp', 'png', 'jpg', 'jpeg'];

    for (const baseName of uniqueBases) {
        if (!baseName) continue;

        for (let i = 1; i <= 10; i++) {
            for (const ext of extensions) {
                const filename = `${baseName}${i}.${ext}`;

                if (files.has(filename)) {
                    validImages.push(`/project/${filename}`);
                    break;
                }
            }
        }

        if (validImages.length > 0) break;
    }

    return validImages;
}
