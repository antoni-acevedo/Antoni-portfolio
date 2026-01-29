import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const GET: APIRoute = async () => {
    const jobs = db.prepare('SELECT * FROM jobs').all();
    return new Response(JSON.stringify(jobs), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    const { company, role, date, description, tag, image, role_en, description_en, tag_en } = body;

    const insert = db.prepare(`
    INSERT INTO jobs (company, role, date, description, tag, image, role_en, description_en, tag_en)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const info = insert.run(company, role, date, description, tag, image, role_en, description_en, tag_en);

    return new Response(JSON.stringify({ id: info.lastInsertRowid }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
