import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.resolve(process.cwd(), 'portfolio.db'));

try {
    db.prepare('ALTER TABLE projects ADD COLUMN active INTEGER NOT NULL DEFAULT 1').run();
    console.log('Added column active to projects');
} catch (error) {
    if (error.message.includes('duplicate column name')) {
        console.log('Column active already exists in projects, skipping.');
    } else {
        throw error;
    }
}
