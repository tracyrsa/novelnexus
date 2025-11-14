import React, { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';
import CharacterCreationForm from './CharacterCreationForm';

const CharactersPage = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const loadCharacters = async () => {
        try {
            const charactersData = await window.electronAPI.databaseQuery(
                'SELECT * FROM characters ORDER BY id DESC'  // ← CHANGED from created_at to id
            );
            setCharacters(charactersData || []);
        } catch (error) {
            console.error("Error loading characters:", error);
            setCharacters([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCharacters();
    }, []);

    const handleCharacterSaved = () => {
        setShowCreateForm(false);
        loadCharacters();
    };

    if (loading) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                color: 'white'
            }}>
                Loading characters...
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '20px 25px',
            color: 'white',
            background: '#1e1e1e',
            height: '100vh',
            overflow: 'auto'
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #4a5568'
            }}>
                <h1 style={{ margin: 0 }}>👤 Character Profiles</h1>
                <button
                    onClick={() => setShowCreateForm(true)}
                    style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    + Add Character
                </button>
            </div>
            
            {/* Content */}
            {characters.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#718096'
                }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>No characters yet</h3>
                    <p style={{ margin: '0 0 20px 0' }}>Start by creating your first character profile</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        Create First Character
                    </button>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {characters.map(character => (
                        <CharacterCard 
                            key={character.id} 
                            character={character}
                            onEdit={() => {/* We'll implement edit later */}}
                            onDelete={() => {/* We'll implement delete later */}}
                        />
                    ))}
                </div>
            )}

            {/* Character Creation Modal */}
            {showCreateForm && (
                <CharacterCreationForm
                    onClose={() => setShowCreateForm(false)}
                    onSave={handleCharacterSaved}
                />
            )}
        </div>
    );
};

export default CharactersPage;