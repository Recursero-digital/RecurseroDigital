import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/pages/adminGameLevels.css';
import { API_BASE_URL } from '../../../infrastructure/config/api';

const GAME_NAMES = {
    'game-ordenamiento': 'Ordenamiento',
    'game-descomposicion': 'Descomposición',
    'game-escala': 'Escala',
    'game-escritura': 'Escritura',
    'game-calculos': 'Cálculos'
};

const GAME_ICONS = {
    'game-ordenamiento': '🔢',
    'game-descomposicion': '🧩',
    'game-escala': '📏',
    'game-escritura': '✍️',
    'game-calculos': '➕'
};

const DIFFICULTY_OPTIONS = ['Fácil', 'Medio', 'Difícil'];

function ConfigEditor({ gameId, config, onChange }) {
    const [localConfig, setLocalConfig] = useState(config || {});

    useEffect(() => {
        setLocalConfig(config || {});
    }, [config]);

    const handleChange = (field, value) => {
        const newConfig = { ...localConfig, [field]: value };
        setLocalConfig(newConfig);
        onChange(newConfig);
    };

    const getGameType = (gameId) => {
        if (gameId.includes('ordenamiento')) return 'ordenamiento';
        if (gameId.includes('descomposicion')) return 'descomposicion';
        if (gameId.includes('escala')) return 'escala';
        if (gameId.includes('escritura')) return 'escritura';
        if (gameId.includes('calculos')) return 'calculos';
        return 'default';
    };

    const gameType = getGameType(gameId);

    switch (gameType) {
        case 'ordenamiento':
            return (
                <div className="config-editor">
                    <div className="config-row">
                        <div className="config-field">
                            <label>Mínimo:</label>
                            <input
                                type="number"
                                value={localConfig.min || ''}
                                onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Máximo:</label>
                            <input
                                type="number"
                                value={localConfig.max || ''}
                                onChange={(e) => handleChange('max', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Cantidad de números:</label>
                            <input
                                type="number"
                                value={localConfig.numbersCount || 6}
                                onChange={(e) => handleChange('numbersCount', parseInt(e.target.value) || 6)}
                                className="config-input"
                                min="1"
                            />
                        </div>
                        <div className="config-field">
                            <label>Color:</label>
                            <input
                                type="text"
                                value={localConfig.color || 'blue'}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="config-input"
                                placeholder="blue"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'descomposicion':
            return (
                <div className="config-editor">
                    <div className="config-row">
                        <div className="config-field">
                            <label>Mínimo:</label>
                            <input
                                type="number"
                                value={localConfig.min || ''}
                                onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Máximo:</label>
                            <input
                                type="number"
                                value={localConfig.max || ''}
                                onChange={(e) => handleChange('max', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Rango (texto):</label>
                            <input
                                type="text"
                                value={localConfig.range || ''}
                                onChange={(e) => handleChange('range', e.target.value)}
                                className="config-input"
                                placeholder="1 al 50"
                            />
                        </div>
                        <div className="config-field">
                            <label>Color:</label>
                            <input
                                type="text"
                                value={localConfig.color || ''}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="config-input"
                                placeholder="blue"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'escala':
            return (
                <div className="config-editor">
                    <div className="config-row">
                        <div className="config-field">
                            <label>Mínimo:</label>
                            <input
                                type="number"
                                value={localConfig.min || ''}
                                onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Máximo:</label>
                            <input
                                type="number"
                                value={localConfig.max || ''}
                                onChange={(e) => handleChange('max', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Operación:</label>
                            <input
                                type="number"
                                value={localConfig.operation || ''}
                                onChange={(e) => handleChange('operation', parseInt(e.target.value) || 0)}
                                className="config-input"
                                placeholder="10"
                            />
                        </div>
                        <div className="config-field">
                            <label>Rango (texto):</label>
                            <input
                                type="text"
                                value={localConfig.range || ''}
                                onChange={(e) => handleChange('range', e.target.value)}
                                className="config-input"
                                placeholder="1 al 50"
                            />
                        </div>
                        <div className="config-field">
                            <label>Color:</label>
                            <input
                                type="text"
                                value={localConfig.color || ''}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="config-input"
                                placeholder="blue"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'escritura':
            return (
                <div className="config-editor">
                    <div className="config-row">
                        <div className="config-field">
                            <label>Mínimo:</label>
                            <input
                                type="number"
                                value={localConfig.min || ''}
                                onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Máximo:</label>
                            <input
                                type="number"
                                value={localConfig.max || ''}
                                onChange={(e) => handleChange('max', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Rango (texto):</label>
                            <input
                                type="text"
                                value={localConfig.range || ''}
                                onChange={(e) => handleChange('range', e.target.value)}
                                className="config-input"
                                placeholder="1 - 50"
                            />
                        </div>
                    </div>
                </div>
            );

        case 'calculos':
            return (
                <div className="config-editor">
                    <div className="config-row">
                        <div className="config-field">
                            <label>Mínimo:</label>
                            <input
                                type="number"
                                value={localConfig.min || ''}
                                onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        <div className="config-field">
                            <label>Máximo:</label>
                            <input
                                type="number"
                                value={localConfig.max || ''}
                                onChange={(e) => handleChange('max', parseInt(e.target.value) || 0)}
                                className="config-input"
                            />
                        </div>
                        {localConfig.operation !== undefined && (
                            <div className="config-field">
                                <label>Operación:</label>
                                <input
                                    type="text"
                                    value={localConfig.operation || ''}
                                    onChange={(e) => handleChange('operation', e.target.value)}
                                    className="config-input"
                                    placeholder="suma, resta, etc"
                                />
                            </div>
                        )}
                        {localConfig.color && (
                            <div className="config-field">
                                <label>Color:</label>
                                <input
                                    type="text"
                                    value={localConfig.color || ''}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    className="config-input"
                                />
                            </div>
                        )}
                    </div>
                </div>
            );

        default:
            return (
                <div className="config-editor">
                    <textarea
                        value={JSON.stringify(localConfig, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                setLocalConfig(parsed);
                                onChange(parsed);
                            } catch (err) {
                                // Invalid JSON, don't update
                            }
                        }}
                        className="config-json"
                        rows="4"
                    />
                </div>
            );
    }
}

export default function AdminGameConfig() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [levels, setLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingLevel, setEditingLevel] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadGames = async () => {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/games/all-with-levels`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Error al cargar juegos');
                }
                
                const data = await response.json();
                setGames(data.games || []);
            } catch (err) {
                console.error('Error al cargar juegos:', err);
                setError('No se pudieron cargar los juegos');
            } finally {
                setLoading(false);
            }
        };
        
        loadGames();
    }, []);

    const handleSelectGame = (game) => {
        setSelectedGame(game);
        setLevels(game.levels || []);
        setEditingLevel(null);
        setEditForm({});
    };

    const handleBackToGames = () => {
        setSelectedGame(null);
        setLevels([]);
        setEditingLevel(null);
        setEditForm({});
    };

    const handleEditLevel = (level) => {
        setEditingLevel(level.id);
        setEditForm({
            name: level.name,
            description: level.description,
            difficulty: level.difficulty,
            activitiesCount: level.activitiesCount,
            config: level.config || {},
            isActive: true
        });
    };

    const handleCancelEdit = () => {
        setEditingLevel(null);
        setEditForm({});
    };

    const handleInputChange = (field, value) => {
        setEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfigChange = (newConfig) => {
        setEditForm(prev => ({
            ...prev,
            config: newConfig
        }));
    };

    const handleSaveLevel = async (levelId) => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE_URL}/games/levels/${levelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editForm.name,
                    description: editForm.description,
                    difficulty: editForm.difficulty,
                    activitiesCount: parseInt(editForm.activitiesCount),
                    config: editForm.config,
                    isActive: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar');
            }

            const loadGames = async () => {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/games/all-with-levels`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setGames(data.games || []);
                const updatedGame = data.games.find(g => g.gameId === selectedGame.gameId);
                if (updatedGame) {
                    setSelectedGame(updatedGame);
                    setLevels(updatedGame.levels || []);
                }
            };

            await loadGames();
            setEditingLevel(null);
            setEditForm({});
        } catch (err) {
            console.error('Error al guardar nivel:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const getGameDisplayName = (gameId) => {
        return GAME_NAMES[gameId] || gameId.replace('game-', '').charAt(0).toUpperCase() + gameId.replace('game-', '').slice(1);
    };

    if (loading) {
        return (
            <div className="admin-game-levels">
                <div className="loading">Cargando juegos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-game-levels">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!selectedGame) {
        return (
            <div className="admin-game-levels">
                <div className="page-header">
                    <h1>Configuración de Juegos</h1>
                    <p>Selecciona un juego para gestionar sus niveles</p>
                </div>

                {games.length === 0 ? (
                    <div className="no-games">
                        <p>No hay juegos configurados</p>
                    </div>
                ) : (
                    <div className="games-grid">
                        {games.map((game) => {
                            const totalActivities = game.levels?.reduce((sum, level) => sum + (level.activitiesCount || 0), 0) || 0;
                            return (
                                <div 
                                    key={game.gameId} 
                                    className="game-card clickable"
                                    onClick={() => handleSelectGame(game)}
                                >
                                    <div className="game-card-header">
                                        <h2>
                                            <span className="game-icon">{GAME_ICONS[game.gameId] || '🎮'}</span>
                                            {getGameDisplayName(game.gameId)}
                                        </h2>
                                    </div>
                                    <div className="game-info">
                                        <div className="game-stat-item">
                                            <span className="game-stat-number">{game.totalLevels}</span>
                                            <span className="game-stat-label">Niveles</span>
                                        </div>
                                        <div className="game-stat-item">
                                            <span className="game-stat-number">{totalActivities}</span>
                                            <span className="game-stat-label">Actividades</span>
                                        </div>
                                    </div>
                     
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="admin-game-levels">
            <div className="page-header">
                <div className="page-header-top">
                    <button 
                        onClick={handleBackToGames}
                        className="btn-back"
                        style={{
                            background: 'rgba(81, 55, 173, 0.788)',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        ← Volver a juegos
                    </button>
                </div>
                <h1>{getGameDisplayName(selectedGame.gameId)}</h1>
                <p>Gestiona los niveles y configuraciones</p>
            </div>

            {levels.length === 0 ? (
                <div className="no-levels">
                    <p>No hay niveles configurados para este juego</p>
                    <button 
                        onClick={handleBackToGames}
                        className="btn-back"
                        style={{
                            marginTop: '1rem',
                            background: 'rgba(81, 55, 173, 0.788)',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        ← Volver a juegos
                    </button>
                </div>
            ) : (
                <div className="levels-table-container">
                    <table className="levels-table">
                        <thead>
                            <tr>
                                <th>Nivel</th>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Dificultad</th>
                                <th>Actividades</th>
                                <th>Configuración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map((level) => (
                                <tr key={level.id} className={!level.isActive ? 'inactive-row' : ''}>
                                    {editingLevel === level.id ? (
                                        <>
                                            <td>{level.level}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editForm.name || ''}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="table-input"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    value={editForm.description || ''}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                    className="table-textarea"
                                                    rows="2"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={editForm.difficulty || ''}
                                                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                                    className="table-select"
                                                >
                                                    {DIFFICULTY_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={editForm.activitiesCount || ''}
                                                    onChange={(e) => handleInputChange('activitiesCount', e.target.value)}
                                                    className="table-input"
                                                    min="1"
                                                />
                                            </td>
                                            <td>
                                                <ConfigEditor
                                                    gameId={selectedGame.gameId}
                                                    config={editForm.config}
                                                    onChange={handleConfigChange}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleSaveLevel(level.id)}
                                                    disabled={saving}
                                                    className="btn-save-small"
                                                >
                                                    {saving ? '...' : '✓'}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={saving}
                                                    className="btn-cancel-small"
                                                >
                                                    ✕
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{level.level}</td>
                                            <td>{level.name}</td>
                                            <td>{level.description}</td>
                                            <td>{level.difficulty}</td>
                                            <td>{level.activitiesCount}</td>
                                            <td>
                                                <div className="config-preview">
                                                    {level.config?.min !== undefined && level.config?.max !== undefined && (
                                                        <span>Rango: {level.config.min} - {level.config.max}</span>
                                                    )}
                                                    {level.config?.numbersCount && (
                                                        <span>Números: {level.config.numbersCount}</span>
                                                    )}
                                                    {level.config?.operation !== undefined && (
                                                        <span>Op: {level.config.operation}</span>
                                                    )}
                                                    {level.config?.range && (
                                                        <span>Rango: {level.config.range}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleEditLevel(level)}
                                                    className="btn-edit-small"
                                                >
                                                    ✏️
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

