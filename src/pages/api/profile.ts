import type { APIRoute } from 'astro';
import db from '../../db/client';

export const GET: APIRoute = async () => {
    const profile = db.prepare('SELECT * FROM profile LIMIT 1').get();
    return new Response(JSON.stringify(profile), {
        headers: { 'Content-Type': 'application/json' },
    });
};

export const PUT: APIRoute = async ({ request }) => {
    const body = await request.json();
    const { title, description, highlight_text, years_experience, experience_text, profile_image, secondary_image, bullet_1, bullet_2 } = body;

    const update = db.prepare(`
    UPDATE profile
    SET title = ?, description = ?, highlight_text = ?, years_experience = ?, experience_text = ?, profile_image = ?, secondary_image = ?, bullet_1 = ?, bullet_2 = ?
    WHERE id = 1
  `);

    update.run(title, description, highlight_text, years_experience, experience_text, profile_image, secondary_image, bullet_1, bullet_2);

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
}
