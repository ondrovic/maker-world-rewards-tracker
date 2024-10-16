export interface NavBarProps {
    title: string;
    navItems: { name: string; href: string }[];
    isDarkMode: boolean;
    collapseOnSelect: boolean;
    setIsDarkMode: (value: boolean) => void;
}