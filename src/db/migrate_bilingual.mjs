import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

console.log('Starting migration to bilingual schema...');

const addColumn = (table, column, type) => {
    try {
        db.prepare(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`).run();
        console.log(`Added column ${column} to ${table}`);
    } catch (error) {
        if (error.message.includes('duplicate column name')) {
            console.log(`Column ${column} already exists in ${table}, skipping.`);
        } else {
            console.error(`Error adding column ${column} to ${table}:`, error.message);
        }
    }
};

// Profile
addColumn('profile', 'title_en', 'TEXT');
addColumn('profile', 'description_en', 'TEXT');
addColumn('profile', 'highlight_text_en', 'TEXT');
addColumn('profile', 'experience_text_en', 'TEXT');
addColumn('profile', 'bullet_1_en', 'TEXT');
addColumn('profile', 'bullet_2_en', 'TEXT');

// Services
addColumn('services', 'title_en', 'TEXT');
addColumn('services', 'description_en', 'TEXT');
addColumn('services', 'tag_en', 'TEXT');

// Projects
addColumn('projects', 'role_en', 'TEXT');
addColumn('projects', 'desc_en', 'TEXT');
addColumn('projects', 'long_desc_en', 'TEXT');

// Jobs
addColumn('jobs', 'role_en', 'TEXT');
addColumn('jobs', 'description_en', 'TEXT');
addColumn('jobs', 'tag_en', 'TEXT');

console.log('Migration completed successfully.');
