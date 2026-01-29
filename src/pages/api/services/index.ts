import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const GET: APIRoute = async () => {
    const services = db.prepare('SELECT * FROM services').all();
    return new Response(JSON.stringify(services), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const { title, description, tag, image, title_en, description_en, tag_en } = body;

    const insert = db.prepare(`
    INSERT INTO services (title, description, tag, image, title_en, description_en, tag_en)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const info = insert.run(title, description, tag, image, title_en, description_en, tag_en);

    return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
