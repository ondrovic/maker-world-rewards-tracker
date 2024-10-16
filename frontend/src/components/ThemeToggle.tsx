import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { iconStyle } from '../styles/styles';
import { ThemeToggleProps } from '../interfaces/ThemeToggleProps';

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, setIsDarkMode }) => {
    
    const handleThemeToggle = (): void => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <FontAwesomeIcon
            icon={isDarkMode ? faSun : faMoon}
            onClick={handleThemeToggle}
            style={iconStyle}
        />
    );
}

export default ThemeToggle;