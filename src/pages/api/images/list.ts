export const prerender = false;

import type { APIRoute } from 'astro';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.resolve(process.cwd(), 'public/images/projectImages');
const IMAGE_EXT = /\.(png|jpg|jpeg|gif|webp|svg)$/i;

export const GET: APIRoute = async ({ url }) => {
  const folder = url.searchParams.get('folder');

  try {
    if (folder) {
      const safeFolder = path.basename(folder);
      const folderPath = path.join(IMAGES_DIR, safeFolder);

      try {
        await stat(folderPath);
      } catch {
        return new Response(
          JSON.stringify({ folder: safeFolder, images: [] }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      }

      const files = await readdir(folderPath);
      const images = files
        .filter(f => IMAGE_EXT.test(f))
        .sort();

      return new Response(
        JSON.stringify({ folder: safeFolder, images }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const entries = await readdir(IMAGES_DIR);
    const folders: { name: string; count: number }[] = [];

    for (const entry of entries) {
      const fullPath = path.join(IMAGES_DIR, entry);
      const statResult = await stat(fullPath);
      if (statResult.isDirectory()) {
        const files = await readdir(fullPath);
        const count = files.filter(f => IMAGE_EXT.test(f)).length;
        folders.push({ name: entry, count });
      }
    }

    folders.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(
      JSON.stringify({ folders }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to list images' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
