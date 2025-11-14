import React from 'react';

const CharacterCard = ({ character, onEdit, onDelete }) => {
    const parseJSONField = (field) => {
        if (!field) return [];
        try {
            return typeof field === 'string' ? JSON.parse(field) : field;
        } catch {
            return [];
        }
    };

    const aliases = parseJSONField(character.aliases);
    const occupations = parseJSONField(character.occupation);

    return (
        <div
            style={{
                background: '#2d3748',
                padding: '20px',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6',
                cursor: 'pointer',
                transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
                e.target.style.background = '#374151';
                e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                e.target.style.background = '#2d3748';
                e.target.style.transform = 'translateY(0)';
            }}
        >
            <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>
                {character.display_name}
            </h3>
            
            {character.full_name && character.full_name !== character.display_name && (
                <p style={{ margin: '0 0 5px 0', color: '#a0aec0', fontSize: '0.9em' }}>
                    {character.full_name}
                </p>
            )}

            <div style={{ marginBottom: '10px' }}>
                {character.species && (
                    <span style={{ 
                        background: '#4a5568', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8em',
                        marginRight: '5px'
                    }}>
                        {character.species}
                    </span>
                )}
                {character.archetype && (
                    <span style={{ 
                        background: '#4a5568', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8em' 
                    }}>
                        {character.archetype}
                    </span>
                )}
            </div>

            {aliases.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8em', color: '#a0aec0' }}>Also known as: </span>
                    {aliases.map((alias, index) => (
                        <span key={index} style={{ 
                            background: '#4a5568', 
                            padding: '1px 6px', 
                            borderRadius: '10px', 
                            fontSize: '0.7em',
                            marginRight: '4px'
                        }}>
                            {alias}
                        </span>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <div style={{ fontSize: '0.8em', color: '#a0aec0' }}>
                    {character.age_current && `Age: ${character.age_current}`}
                    {character.age_total && character.age_current && ` / ${character.age_total}`}
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        style={{
                            background: 'transparent',
                            border: '1px solid #4a5568',
                            color: '#a0aec0',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7em'
                        }}
                    >
                        Edit
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        style={{
                            background: 'transparent',
                            border: '1px solid #dc2626',
                            color: '#dc2626',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.7em'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;