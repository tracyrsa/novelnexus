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

// Characters table - COMPREHENSIVE VERSION
this.db.run(`
    CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        novel_id INTEGER,
        
        -- Core Identity
        display_name TEXT NOT NULL,
        full_name TEXT,
        aliases TEXT,
        archetype TEXT,
        species TEXT,
        subspecies TEXT,
        gender TEXT,
        pronouns TEXT,
        age_current INTEGER,
        age_total INTEGER,
        date_of_birth TEXT,
        status TEXT DEFAULT 'Alive',
        occupation TEXT,
        affiliation TEXT,
        residence TEXT,
        homeworld TEXT,
        dimension TEXT,
        alignment TEXT,
        archetype_role TEXT,
        core_truth TEXT,
        
        -- Physical Description
        height TEXT,
        build TEXT,
        hair_color TEXT,
        eye_color TEXT,
        skin_tone TEXT,
        distinctive_features TEXT,
        voice_description TEXT,
        fashion_style TEXT,
        health_status TEXT,
        species_traits TEXT,
        aura_description TEXT,
        post_transformation_changes TEXT,
        transformation_stages TEXT,
        visual_reference TEXT,
        
        -- Psychological Profile
        personality_summary TEXT,
        personality_traits_positive TEXT,
        personality_traits_negative TEXT,
        mbti_type TEXT,
        temperament TEXT,
        motivations TEXT,
        fears TEXT,
        values_and_beliefs TEXT,
        mental_stability TEXT,
        coping_mechanisms TEXT,
        thought_patterns TEXT,
        emotional_triggers TEXT,
        decision_making_style TEXT,
        
        -- Relationships & Social Web
        relationship_status TEXT,
        family_relations TEXT,
        allies TEXT,
        enemies TEXT,
        mentor TEXT,
        protege TEXT,
        rival TEXT,
        romantic_interests TEXT,
        companions TEXT,
        relationship_graph TEXT,
        trust_level_default TEXT,
        relationship_notes TEXT,
        
        -- Backstory & Timeline
        birthplace TEXT,
        ancestry TEXT,
        education TEXT,
        key_life_events TEXT,
        trauma_events TEXT,
        timeline_summary TEXT,
        previous_lives TEXT,
        secrets TEXT,
        first_appearance TEXT,
        notable_achievements TEXT,
        
        -- Skills, Powers & Abilities
        skill_type TEXT,
        primary_skills TEXT,
        secondary_skills TEXT,
        power_system_origin TEXT,
        signature_abilities TEXT,
        power_level TEXT,
        limitations TEXT,
        equipment_inventory TEXT,
        fighting_style TEXT,
        special_traits TEXT,
        evolution_stages TEXT,
        combat_rank TEXT,
        affinity_elements TEXT,
        technological_integration BOOLEAN,
        
        -- Role in Story
        story_role TEXT,
        narrative_function TEXT,
        arc_type TEXT,
        story_goals TEXT,
        stakes TEXT,
        growth_arc_summary TEXT,
        themes_embodied TEXT,
        symbolism TEXT,
        linked_chapters TEXT,
        key_scenes TEXT,
        death_or_exit_event TEXT,
        
        -- Dialogue & Voice
        tone TEXT,
        rhythm TEXT,
        common_phrases TEXT,
        accent_or_speech_pattern TEXT,
        example_dialogue TEXT,
        inner_monologue_style TEXT,
        
        -- Cultural, Political & Dimensional Context
        culture TEXT,
        religion TEXT,
        political_alignment TEXT,
        social_class TEXT,
        language TEXT,
        region TEXT,
        planetary_system TEXT,
        dimensional_origin TEXT,
        economic_status TEXT,
        reputation_score INTEGER,
        public_perception TEXT,
        citizenship_status TEXT,
        
        -- Meta & Author Notes
        author_notes TEXT,
        voice_reference TEXT,
        visual_inspiration TEXT,
        tags TEXT,
        writing_guidelines TEXT,
        scene_prompt_examples TEXT,
        version_history TEXT,
        revision_status TEXT DEFAULT 'Draft',
        author_rating INTEGER,
        linked_codex_entries TEXT,
        
        -- System
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (novel_id) REFERENCES novels (id)
    )
`, (err) => {
    if (err) {
        console.error('Error creating characters table:', err);
        reject(err);
    } else {
        console.log('Characters table created/verified');
        resolve();
    }
});
        });
    }
}

module.exports = new Database();