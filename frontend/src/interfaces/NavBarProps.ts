interface NavBarProps {
    title: string;
    navItems: { name: string; href: string }[];
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}