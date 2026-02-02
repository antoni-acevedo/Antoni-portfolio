
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

console.log('Starting migration for Featured Projects (Carousel)...');

db.exec(`
  CREATE TABLE IF NOT EXISTS featured_projects (
    id INTEGER PRIMARY KEY,
    title TEXT,
    client TEXT,
    image TEXT,
    category TEXT,
    category_en TEXT,
    link TEXT,
    sort_order INTEGER DEFAULT 0
  );
`);

console.log('Table featured_projects created.');

// Seed some initial data if empty
const count = db.prepare('SELECT count(*) as count FROM featured_projects').get();

if (count.count === 0) {
    console.log('Seeding initial featured projects...');
    const insert = db.prepare(`
        INSERT INTO featured_projects (title, client, image, category, category_en) 
        VALUES (?, ?, ?, ?, ?)
    `);

    insert.run("Validocus", "Soluciones Star", "mockImg.png", "Plataforma Web", "Web Platform");
    insert.run("AdWorkChain", "Vinix Code", "mockImg.png", "Gestión", "Management");
    insert.run("Metradesk", "Soluciones Star", "mockImg.png", "Fintech", "Fintech");
    insert.run("TransferX", "Konecta", "mockImg.png", "Logística", "Logistics");
}

console.log('Migration featured_projects completed.');
