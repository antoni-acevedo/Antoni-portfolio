import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { company, role, date, description, tag, image, role_en, description_en, tag_en } = body;

    const update = db.prepare(`
    UPDATE jobs
    SET company = ?, role = ?, date = ?, description = ?, tag = ?, image = ?, role_en = ?, description_en = ?, tag_en = ?
    WHERE id = ?
  `);

    update.run(company, role, date, description, tag, image, role_en, description_en, tag_en, id);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    const del = db.prepare('DELETE FROM jobs WHERE id = ?');
    del.run(id);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
