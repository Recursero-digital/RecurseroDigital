import React from 'react';
import { levelRanges } from './utils';

const LevelSelectScreen = ({ onSelectLevel }) => (
    <div className="chalkboard">
        <h2>Elige un nivel</h2>
        <div className="level-grid">
            {levelRanges.map((range, index) => (
                <button key={index} onClick={() => onSelectLevel(index + 1)} className={`btn level-btn level-${index + 1}`}>
                    Nivel {index + 1}<br/>({range.min} - {range.max})
                </button>
            ))}
        </div>
    </div>
);
export default LevelSelectScreen;