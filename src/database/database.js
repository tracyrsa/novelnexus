const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { setupAdvancedSchemas } = require('./schemas');

// Explain: This creates/connects to our local database file
class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, '..', '..', 'novelnexus.db');
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.initTables().then(resolve).catch(reject);
                }
            });
        });
    }

    // Explain: Creates tables for novels, chapters, characters
    async initTables() {
        return new Promise((resolve, reject) => {
            // Novels table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS novels (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    author TEXT DEFAULT 'You',
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    word_count INTEGER DEFAULT 0,
                    chapter_count INTEGER DEFAULT 0,
                    synopsis TEXT,
                    cover_image BLOB
                )
            `);

            // Chapters table  
            this.db.run(`
                CREATE TABLE IF NOT EXISTS chapters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    novel_id INTEGER,
                    title TEXT NOT NULL,
                    content TEXT,
                    word_count INTEGER DEFAULT 0,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    published_date DATETIME,
                    chapter_number INTEGER,
                    status TEXT DEFAULT 'draft',
                    FOREIGN KEY (novel_id) REFERENCES novels (id)
                )
            `);

            // Characters table
            this.db.run(`
                CREATE TABLE IF NOT EXISTS characters (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    novel_id INTEGER,
                    name TEXT NOT NULL,
                    description TEXT,
                    role TEXT,
                    notes TEXT,
                    FOREIGN KEY (novel_id) REFERENCES novels (id)
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new Database();