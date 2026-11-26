export const prerender = false;

import type { APIRoute } from 'astro';
import { unlink } from 'fs/promises';
import path from 'path';
import db from '../../../db/client';

const IMAGES_DIR = path.resolve(process.cwd(), 'public/images/projectImages');
const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp|svg)$/i;

const json = (body: object, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const DELETE: APIRoute = async ({ request }) => {
    const { folder, filename } = await request.json();

    if (typeof folder !== 'string' || typeof filename !== 'string' || !IMAGE_EXT.test(filename)) {
        return json({ error: 'Invalid folder or filename' }, 400);
    }

    const target = path.resolve(IMAGES_DIR, folder, filename);
    if (path.dirname(path.dirname(target)) !== IMAGES_DIR) {
        return json({ error: 'Invalid path' }, 400);
    }

    try {
        await unlink(target);
    } catch (error: any) {
        if (error.code !== 'ENOENT') return json({ error: 'Could not delete file' }, 500);
    }

    // Drop the deleted file from every project that still references it.
    const suffix = `projectImages/${folder}/${filename}`;
    const projects = db.prepare('SELECT id, images FROM projects').all() as { id: number; images: string }[];
    const update = db.prepare('UPDATE projects SET images = ? WHERE id = ?');
    for (const p of projects) {
        const images: string[] = JSON.parse(p.images);
        const kept = images.filter((img) => !img.endsWith(suffix));
        if (kept.length !== images.length) update.run(JSON.stringify(kept), p.id);
    }

    return json({ success: true });
};
