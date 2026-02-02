
import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { title, client, image, category, category_en } = body;

    const update = db.prepare(`
    UPDATE featured_projects
    SET title = ?, client = ?, image = ?, category = ?, category_en = ?
    WHERE id = ?
  `);

    update.run(
        title,
        client,
        image,
        category,
        category_en,
        id
    );

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const DELETE: APIRoute = async ({ params }) => {
    const { id } = params;

    const del = db.prepare('DELETE FROM featured_projects WHERE id = ?');
    del.run(id);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};
