import React from 'react';
import './ThemeSelector.css';
import themes from '../themes';

const ThemeSelector = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="theme-selector">
      <div className="theme-selector-label">Board Theme:</div>
      <div className="theme-options">
        {Object.keys(themes).map(themeKey => (
          <div 
            key={themeKey}
            className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
            onClick={() => onThemeChange(themeKey)}
            title={themes[themeKey].name}
          >
            <div 
              className="theme-preview"
              style={{
                background: `linear-gradient(135deg, 
                  ${themes[themeKey].lightSquare} 0%, 
                  ${themes[themeKey].lightSquare} 50%, 
                  ${themes[themeKey].darkSquare} 50%, 
                  ${themes[themeKey].darkSquare} 100%)`
              }}
            ></div>
            <span className="theme-name">{themes[themeKey].name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 