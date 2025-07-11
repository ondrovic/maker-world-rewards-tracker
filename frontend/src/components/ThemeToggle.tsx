import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ThemeToggleProps } from '../interfaces/ThemeToggleProps';
import { iconStyle } from '../styles/styles';

// Pure function for icon selection
const getThemeIcon = (isDarkMode: boolean) => (isDarkMode ? faSun : faMoon);

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, setIsDarkMode }) => {
    const handleThemeToggle = (): void => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <FontAwesomeIcon
            icon={getThemeIcon(isDarkMode)}
            onClick={handleThemeToggle}
            style={iconStyle}
        />
    );
};

export default ThemeToggle;