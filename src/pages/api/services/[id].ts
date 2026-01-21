import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { title, description, tag, image } = body;

    const update = db.prepare(`
    UPDATE services
    SET title = ?, description = ?, tag = ?, image = ?
    WHERE id = ?
  `);

    update.run(title, description, tag, image, id);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    const del = db.prepare('DELETE FROM services WHERE id = ?');
    del.run(id);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
