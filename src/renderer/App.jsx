const { useState, useEffect } = React;

// CHARACTERS PAGE COMPONENT
function SimpleCharactersPage() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        display_name: '',
        full_name: '',
        archetype: '',
        species: '',
        gender: '',
        age_current: ''
    });

    // Load characters from database
    const loadCharacters = async () => {
        try {
            const charactersData = await window.electronAPI.databaseQuery(
                'SELECT * FROM characters ORDER BY id DESC'
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

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        if (!formData.display_name.trim()) {
            alert('Please enter a display name');
            return;
        }

        try {
            await window.electronAPI.databaseRun(
                `INSERT INTO characters (
                    display_name, full_name, archetype, species, gender, age_current
                ) VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    formData.display_name,
                    formData.full_name,
                    formData.archetype,
                    formData.species,
                    formData.gender,
                    formData.age_current
                ]
            );
            
            setShowCreateForm(false);
            setFormData({ display_name: '', full_name: '', archetype: '', species: '', gender: '', age_current: '' });
            loadCharacters();
            alert('Character saved successfully!');
        } catch (error) {
            console.error("Error saving character:", error);
            alert("Error saving character. The characters table might not exist yet.");
        }
    };

    const archetypeOptions = ['The Hero', 'The Mentor', 'The Guardian', 'The Trickster', 'The Shadow', 'The Herald'];
    const speciesOptions = ['Human', 'Elf', 'Draconian', 'AI', 'Divine Being', 'Custom'];

    if (loading) {
        return React.createElement('div', { 
            style: { 
                padding: '40px', 
                textAlign: 'center',
                color: 'white'
            } 
        }, 'Loading characters...');
    }

    return React.createElement('div', { 
        style: { 
            padding: '20px 25px',
            color: 'white',
            background: '#1e1e1e',
            minHeight: '100vh'
        } 
    },
        // Header
        React.createElement('div', { 
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #4a5568'
            }
        },
            React.createElement('h1', { style: { margin: 0 } }, '👤 Character Profiles'),
            React.createElement('button', {
                onClick: () => setShowCreateForm(true),
                style: {
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                }
            }, '+ Add Character')
        ),
        
        // Content
        characters.length === 0 
            ? React.createElement('div', { 
                style: {
                    textAlign: 'center',
                    padding: '60px 20px',
                    color: '#718096'
                }
            },
                React.createElement('h3', { style: { margin: '0 0 10px 0' } }, 'No characters yet'),
                React.createElement('p', { style: { margin: '0 0 20px 0' } }, 'Start by creating your first character profile'),
                React.createElement('button', {
                    onClick: () => setShowCreateForm(true),
                    style: {
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }
                }, 'Create First Character')
              )
            : React.createElement('div', { 
                style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }
            },
                characters.map(character => 
                    React.createElement('div', { 
                        key: character.id,
                        style: {
                            background: '#2d3748',
                            padding: '20px',
                            borderRadius: '8px',
                            borderLeft: '4px solid #3b82f6',
                            cursor: 'pointer'
                        }
                    },
                        React.createElement('h3', { style: { margin: '0 0 10px 0' } }, character.display_name || character.name),
                        React.createElement('p', { style: { margin: '0 0 5px 0', color: '#a0aec0' } }, 
                            character.species || 'Unknown species'
                        ),
                        React.createElement('p', { style: { margin: 0, color: '#a0aec0' } }, 
                            character.archetype || 'No archetype'
                        )
                    )
                )
              ),

        // Character Creation Modal
        showCreateForm && React.createElement('div', {
            style: {
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
            }
        },
            React.createElement('div', { 
                style: { 
                    background: '#2d3748',
                    padding: '25px',
                    borderRadius: '8px',
                    width: '500px',
                    maxWidth: '90vw',
                    border: '2px solid #4a5568'
                } 
            },
                React.createElement('h2', { style: { margin: '0 0 20px 0', color: 'white', textAlign: 'center' } }, 'Create New Character'),
                
                // Form Fields
                React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                    // Display Name
                    React.createElement('div', null,
                        React.createElement('label', { 
                            style: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' } 
                        }, 'Display Name *'),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.display_name,
                            onChange: (e) => handleInputChange('display_name', e.target.value),
                            placeholder: 'How the character is primarily known...',
                            style: {
                                width: '100%',
                                padding: '10px',
                                background: '#1a202c',
                                border: '1px solid #4a5568',
                                color: 'white',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }
                        })
                    ),
                    
                    // Full Name
                    React.createElement('div', null,
                        React.createElement('label', { 
                            style: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'white' } 
                        }, 'Full Name'),
                        React.createElement('input', {
                            type: 'text',
                            value: formData.full_name,
                            onChange: (e) => handleInputChange('full_name', e.target.value),
                            placeholder: 'Legal or birth name...',
                            style: {
                                width: '100%',
                                padding: '10px',
                                background: '#1a202c',
                                border: '1px solid #4a5568',
                                color: 'white',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }
                        })
                    )
                ),

                // Buttons
                React.createElement('div', { 
                    style: {
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end',
                        marginTop: '25px',
                        paddingTop: '15px',
                        borderTop: '1px solid #4a5568'
                    }
                },
                    React.createElement('button', {
                        onClick: () => setShowCreateForm(false),
                        style: {
                            background: '#718096',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }
                    }, 'Cancel'),
                    React.createElement('button', {
                        onClick: handleSave,
                        disabled: !formData.display_name.trim(),
                        style: {
                            background: !formData.display_name.trim() ? '#4a5568' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: !formData.display_name.trim() ? 'not-allowed' : 'pointer'
                        }
                    }, 'Save Character')
                )
            )
        )
    );
}

// MAIN APP COMPONENT
function App() {
    const [currentView, setCurrentView] = useState('novelList');
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNovels();
    }, []);

    async function loadNovels() {
        try {
            const novelsData = await window.electronAPI.databaseQuery(
                'SELECT * FROM novels ORDER BY created_date DESC'
            );
            setNovels(novelsData || []);
        } catch (error) {
            console.error('Failed to load novels:', error);
            setNovels([]);
        } finally {
            setLoading(false);
        }
    }

    async function addSampleNovel() {
        const novelTitle = prompt("Enter your novel's title:");
        if (!novelTitle) return;

        try {
            await window.electronAPI.databaseRun(
                'INSERT INTO novels (title, author) VALUES (?, ?)',
                [novelTitle, 'You']
            );
            await loadNovels();
            alert(`Added "${novelTitle}" to your library!`);
        } catch (error) {
            alert('Error adding novel: ' + error.message);
        }
    }

    if (loading) {
        return React.createElement('div', { 
            style: { 
                padding: '40px', 
                textAlign: 'center',
                color: 'white'
            } 
        }, 'Loading your writing studio...');
    }

    return React.createElement('div', { className: 'app' },
        // Navigation Bar
        React.createElement('div', { 
            style: { 
                background: '#2d3748', 
                padding: '15px 20px',
                borderBottom: '1px solid #4a5568'
            }
        },
            React.createElement('div', { 
                style: { 
                    display: 'flex', 
                    gap: '15px',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }
            },
                React.createElement('button', {
                    onClick: () => setCurrentView('novelList'),
                    style: {
                        background: currentView === 'novelList' ? '#3b82f6' : '#4a5568',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }
                }, '📚 Novels'),
                React.createElement('button', {
                    onClick: () => setCurrentView('characters'),
                    style: {
                        background: currentView === 'characters' ? '#3b82f6' : '#4a5568',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }
                }, '👤 Characters')
            )
        ),
        
        // Main Content
        currentView === 'novelList' 
            ? React.createElement('div', { className: 'app-content' },
                React.createElement('div', { className: 'app-header' },
                    React.createElement('h1', null, '📚 NovelNexus'),
                    React.createElement('p', null, 'Your All-in-One Writing Studio')
                ),
                
                React.createElement('div', { className: 'novel-list' },
                    React.createElement('div', { className: 'list-header' },
                        React.createElement('h2', null, 'Your Novels'),
                        React.createElement('button', { 
                            onClick: addSampleNovel,
                            className: 'add-novel-btn'
                        }, '+ Add Your Novel')
                    ),
                    
                    novels.length === 0 
                        ? React.createElement('div', { className: 'empty-state' },
                            React.createElement('p', null, 'No novels yet. Add your first novel to get started!'),
                            React.createElement('button', { 
                                onClick: addSampleNovel,
                                className: 'cta-button'
                            }, 'Add Your Novel')
                          )
                        : React.createElement('div', { className: 'novels-grid' },
                            novels.map(novel => 
                                React.createElement('div', { 
                                    key: novel.id,
                                    className: 'novel-card'
                                },
                                    React.createElement('h3', null, novel.title),
                                    React.createElement('p', null, `By: ${novel.author}`),
                                    React.createElement('p', null, `Chapters: ${novel.chapter_count || 0}`),
                                    React.createElement('p', null, `Words: ${novel.word_count || 0}`)
                                )
                            )
                          )
                )
              )
            : React.createElement(SimpleCharactersPage)
    );
}

// Add some basic styling
const style = document.createElement('style');
style.textContent = `
    .app { background: #1e1e1e; color: white; min-height: 100vh; }
    .app-content { max-width: 1000px; margin: 0 auto; }
    .app-header { text-align: center; padding: 40px 20px; }
    .novel-list { padding: 20px; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .add-novel-btn, .cta-button { 
        background: #3b82f6; color: white; border: none; padding: 10px 20px; 
        border-radius: 5px; cursor: pointer; font-size: 14px;
    }
    .novels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .novel-card { 
        background: #2d3748; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;
        cursor: pointer;
    }
    .novel-card:hover {
        background: #374151;
        transform: translateY(-2px);
        transition: all 0.2s;
    }
    .novel-card h3 { margin: 0 0 10px 0; color: #e2e8f0; }
    .novel-card p { margin: 5px 0; color: #a0aec0; }
    .empty-state { text-align: center; padding: 60px 20px; color: #718096; }
    .loading { text-align: center; padding: 40px; font-size: 18px; }
`;

document.head.appendChild(style);

// Render our React app
ReactDOM.render(React.createElement(App), document.getElementById('root'));