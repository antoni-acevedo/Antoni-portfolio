export const prerender = false;

import type { APIRoute } from 'astro';
import db from '../../../db/client';

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const { company, role, date, desc, long_desc, tags, images, role_en, desc_en, long_desc_en, active } = body;

    const update = db.prepare(`
    UPDATE projects
    SET company = ?, role = ?, date = ?, desc = ?, long_desc = ?, tags = ?, images = ?, role_en = ?, desc_en = ?, long_desc_en = ?, active = COALESCE(?, active)
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
        role_en,
        desc_en,
        long_desc_en,
        active === undefined ? null : Number(Boolean(active)),
        id
    );

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const PATCH: APIRoute = async ({ params, request }) => {
    const { active } = await request.json();
    if (typeof active !== 'boolean') {
        return new Response(JSON.stringify({ error: 'active must be boolean' }), { status: 400 });
    }

    db.prepare('UPDATE projects SET active = ? WHERE id = ?').run(Number(active), params.id);

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
