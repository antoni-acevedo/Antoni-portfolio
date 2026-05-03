export const prerender = false;

import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const GET: APIRoute = async () => {
    const projectsRaw = db.prepare('SELECT * FROM projects').all();

    const projects = projectsRaw.map((p: any) => ({
        ...p,
        tags: JSON.parse(p.tags),
        images: JSON.parse(p.images),
    }));

    return new Response(JSON.stringify(projects), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const { company, role, date, desc, long_desc, tags, images, role_en, desc_en, long_desc_en } = body;

    const insert = db.prepare(`
    INSERT INTO projects (company, role, date, desc, long_desc, tags, images, role_en, desc_en, long_desc_en)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    // Assume body sends arrays for tags/images, we stringify
    const info = insert.run(
        company,
        role,
        date,
        desc,
        long_desc,
        JSON.stringify(tags),
        JSON.stringify(images),
        role_en,
        desc_en,
        long_desc_en
    );

    return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
