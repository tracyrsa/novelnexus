// Additional database tables for world-building and characters
const setupAdvancedSchemas = (db) => {
    return new Promise((resolve, reject) => {
        // World Bible Categories table
        db.run(`
            CREATE TABLE IF NOT EXISTS world_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                novel_id INTEGER,
                name TEXT NOT NULL,
                description TEXT,
                parent_id INTEGER DEFAULT NULL,
                color TEXT DEFAULT '#3b82f6',
                sort_order INTEGER DEFAULT 0,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (novel_id) REFERENCES novels (id),
                FOREIGN KEY (parent_id) REFERENCES world_categories (id)
            )
        `);

        // World Bible Entries table
        db.run(`
            CREATE TABLE IF NOT EXISTS world_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                novel_id INTEGER,
                category_id INTEGER,
                title TEXT NOT NULL,
                content TEXT,
                tags TEXT,
                is_template BOOLEAN DEFAULT 0,
                template_fields TEXT,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (novel_id) REFERENCES novels (id),
                FOREIGN KEY (category_id) REFERENCES world_categories (id)
            )
        `);

        // Character Profiles table
        db.run(`
            CREATE TABLE IF NOT EXISTS characters (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                novel_id INTEGER,
                name TEXT NOT NULL,
                role TEXT,
                status TEXT,
                description TEXT,
                physical_description TEXT,
                personality TEXT,
                background TEXT,
                motivations TEXT,
                character_arc TEXT,
                relationships TEXT,
                notes TEXT,
                profile_image BLOB,
                is_template BOOLEAN DEFAULT 0,
                custom_fields TEXT,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (novel_id) REFERENCES novels (id)
            )
        `);

        // Character Relationships table
        db.run(`
            CREATE TABLE IF NOT EXISTS character_relationships (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                novel_id INTEGER,
                character_a_id INTEGER,
                character_b_id INTEGER,
                relationship_type TEXT,
                description TEXT,
                intensity INTEGER DEFAULT 5,
                is_reciprocal BOOLEAN DEFAULT 1,
                notes TEXT,
                FOREIGN KEY (novel_id) REFERENCES novels (id),
                FOREIGN KEY (character_a_id) REFERENCES characters (id),
                FOREIGN KEY (character_b_id) REFERENCES characters (id)
            )
        `, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

module.exports = { setupAdvancedSchemas };