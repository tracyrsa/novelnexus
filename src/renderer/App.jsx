const { useState, useEffect } = React;

// Explain: This is our main React component - manages state and UI
function App() {
    const [novels, setNovels] = useState([]);
    const [loading, setLoading] = useState(true);

    // Explain: useEffect runs when component loads - perfect for fetching data
    useEffect(() => {
        loadNovels();
    }, []);

    // Explain: Async function to get data from SQLite via Electron
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

    // Explain: Function to add YOUR novel to the database
    async function addSampleNovel() {
        const novelTitle = prompt("Enter your novel's title:");
        if (!novelTitle) return;

        try {
            await window.electronAPI.databaseRun(
                'INSERT INTO novels (title, author) VALUES (?, ?)',
                [novelTitle, 'You']
            );
            await loadNovels(); // Refresh the list
            alert(`Added "${novelTitle}" to your library!`);
        } catch (error) {
            alert('Error adding novel: ' + error.message);
        }
    }

    if (loading) {
        return React.createElement('div', { className: 'loading' }, 'Loading your writing studio...');
    }

    return React.createElement('div', { className: 'app' },
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
    );
}

// Add some basic styling
const style = document.createElement('style');
style.textContent = `
    .novel-list { padding: 20px; max-width: 1000px; margin: 0 auto; }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .add-novel-btn, .cta-button { 
        background: #3b82f6; color: white; border: none; padding: 10px 20px; 
        border-radius: 5px; cursor: pointer; font-size: 14px;
    }
    .novels-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .novel-card { 
        background: #2d3748; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;
    }
    .novel-card h3 { margin: 0 0 10px 0; color: #e2e8f0; }
    .novel-card p { margin: 5px 0; color: #a0aec0; }
    .empty-state { text-align: center; padding: 60px 20px; color: #718096; }
    .loading { text-align: center; padding: 40px; font-size: 18px; }
`;

document.head.appendChild(style);

// Render our React app
ReactDOM.render(React.createElement(App), document.getElementById('root'));