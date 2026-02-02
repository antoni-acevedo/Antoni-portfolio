
import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const GET: APIRoute = async () => {
    const projects = db.prepare('SELECT * FROM featured_projects').all();
    return new Response(JSON.stringify(projects), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const { title, client, image, category, category_en } = body;

    const insert = db.prepare(`
    INSERT INTO featured_projects (title, client, image, category, category_en)
    VALUES (?, ?, ?, ?, ?)
  `);

    const info = insert.run(
        title,
        client,
        image,
        category,
        category_en
    );

    return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
