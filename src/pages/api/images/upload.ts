export const prerender = false;

import type { APIRoute } from 'astro';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.resolve(process.cwd(), 'public/images/projectImages');
const ALLOWED_EXT = /\.(png|jpg|jpeg|gif|webp|svg)$/i;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const folder = formData.get('folder') as string;

    if (!folder || !folder.trim()) {
      return new Response(
        JSON.stringify({ error: 'Folder name is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const safeFolder = path.basename(folder.trim());
    const uploadDir = path.join(IMAGES_DIR, safeFolder);
    await mkdir(uploadDir, { recursive: true });

    const files = formData.getAll('files') as File[];
    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const uploaded: string[] = [];

    for (const file of files) {
      if (!ALLOWED_EXT.test(file.name)) continue;
      if (file.size > MAX_FILE_SIZE) continue;
      if (file.size === 0) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(uploadDir, file.name);

      let finalPath = filePath;
      let finalName = file.name;
      if (await statExists(finalPath)) {
        const ext = path.extname(file.name);
        const base = path.basename(file.name, ext);
        let counter = 1;
        do {
          finalName = `${base}_${counter}${ext}`;
          finalPath = path.join(uploadDir, finalName);
          counter++;
        } while (await statExists(finalPath));
      }

      await writeFile(finalPath, buffer);
      uploaded.push(finalName);
    }

    return new Response(
      JSON.stringify({ folder: safeFolder, uploaded }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Upload failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

async function statExists(p: string): Promise<boolean> {
  try {
    const { stat } = await import('fs/promises');
    await stat(p);
    return true;
  } catch {
    return false;
  }
}
