import React, { useState } from 'react';

const CharacterCreationForm = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        display_name: '',
        full_name: '',
        aliases: [],
        archetype: '',
        species: '',
        gender: '',
        pronouns: '',
        age_current: '',
        age_total: '',
        status: 'Alive',
        occupation: [],
    });

    const [currentSection, setCurrentSection] = useState('core_identity');
    const [newAlias, setNewAlias] = useState('');
    const [newOccupation, setNewOccupation] = useState('');

    const archetypeOptions = ['The Hero', 'The Mentor', 'The Guardian', 'The Trickster', 'The Shadow', 'The Herald'];
    const speciesOptions = ['Human', 'Elf', 'Draconian', 'AI', 'Divine Being', 'Custom'];
    const statusOptions = ['Alive', 'Deceased', 'Reincarnated', 'Unknown'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayAdd = (field, value, setter) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    };

    const handleArrayRemove = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        try {
            await window.electronAPI.databaseRun(
                `INSERT INTO characters (
                    display_name, full_name, aliases, archetype, species, gender, pronouns,
                    age_current, age_total, status, occupation
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    formData.display_name,
                    formData.full_name,
                    JSON.stringify(formData.aliases),
                    formData.archetype,
                    formData.species,
                    formData.gender,
                    formData.pronouns,
                    formData.age_current,
                    formData.age_total,
                    formData.status,
                    JSON.stringify(formData.occupation)
                ]
            );
            
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving character:", error);
            alert("Error saving character. Please try again.");
        }
    };

    const sections = [
        { id: 'core_identity', label: 'Core Identity', icon: '🆔' },
        { id: 'physical_description', label: 'Physical', icon: '👤' },
    ];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div 
                style={{ 
                    background: '#2d3748',
                    padding: '25px',
                    borderRadius: '8px',
                    width: '600px',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '2px solid #4a5568'
                }} 
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #4a5568'
                }}>
                    <h2 style={{ margin: 0, color: 'white' }}>Create New Character</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#a0aec0',
                            fontSize: '1.5em',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '5px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setCurrentSection(section.id)}
                            style={{
                                background: currentSection === section.id ? '#3b82f6' : '#4a5568',
                                color: 'white',
                                border: 'none',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <span>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Form Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: '10px'
                }}>
                    {currentSection === 'core_identity' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                        Display Name*
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.display_name}
                                        onChange={(e) => handleInputChange('display_name', e.target.value)}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: '#1a202c',
                                            border: '1px solid #4a5568',
                                            color: 'white',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: '#1a202c',
                                            border: '1px solid #4a5568',
                                            color: 'white',
                                            borderRadius: '4px',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                        Archetype
                                    </label>
                                    <select
                                        value={formData.archetype}
                                        onChange={(e) => handleInputChange('archetype', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: '#1a202c',
                                            border: '1px solid #4a5568',
                                            color: 'white',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="">Select Archetype...</option>
                                        {archetypeOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                        Species
                                    </label>
                                    <select
                                        value={formData.species}
                                        onChange={(e) => handleInputChange('species', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '8px',
                                            background: '#1a202c',
                                            border: '1px solid #4a5568',
                                            color: 'white',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="">Select Species...</option>
                                        {speciesOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Aliases */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: 'white' }}>
                                    Aliases
                                </label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        value={newAlias}
                                        onChange={(e) => setNewAlias(e.target.value)}
                                        placeholder="Add an alias..."
                                        style={{ 
                                            flex: 1, 
                                            padding: '8px', 
                                            background: '#1a202c', 
                                            border: '1px solid #4a5568', 
                                            color: 'white', 
                                            borderRadius: '4px' 
                                        }}
                                    />
                                    <button
                                        onClick={() => handleArrayAdd('aliases', newAlias, setNewAlias)}
                                        style={{ 
                                            background: '#3b82f6', 
                                            color: 'white', 
                                            border: 'none', 
                                            padding: '8px 12px', 
                                            borderRadius: '4px', 
                                            cursor: 'pointer' 
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                                {formData.aliases.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {formData.aliases.map((alias, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    background: '#4a5568',
                                                    padding: '4px 8px',
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px'
                                                }}
                                            >
                                                {alias}
                                                <button
                                                    onClick={() => handleArrayRemove('aliases', index)}
                                                    style={{ 
                                                        background: 'none', 
                                                        border: 'none', 
                                                        color: '#a0aec0', 
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentSection === 'physical_description' && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                            <h3>Physical Description Section</h3>
                            <p>This section will be fully implemented next!</p>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid #4a5568'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#718096',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!formData.display_name.trim()}
                        style={{
                            background: !formData.display_name.trim() ? '#4a5568' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: !formData.display_name.trim() ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Save Character
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CharacterCreationForm;