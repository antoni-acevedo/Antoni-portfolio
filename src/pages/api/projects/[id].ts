import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { company, role, date, desc, long_desc, tags, images } = body;

    const update = db.prepare(`
    UPDATE projects
    SET company = ?, role = ?, date = ?, desc = ?, long_desc = ?, tags = ?, images = ?
    WHERE id = ?
  `);

    update.run(
        company,
        role,
        date,
        desc,
        long_desc,
        JSON.stringify(tags),
        JSON.stringify(images),
        id
    );

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    const del = db.prepare('DELETE FROM projects WHERE id = ?');
    del.run(id);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
