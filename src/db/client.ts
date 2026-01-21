import Database from 'better-sqlite3';
import path from 'path';

// Resolve the path to the database file
// In a real app, this might be configurable
const dbPath = path.resolve(process.cwd(), 'portfolio.db');

const db = new Database(dbPath);

export default db;
