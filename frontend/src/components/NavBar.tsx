import React from "react";
import { Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import { NavBarProps } from "../interfaces/NavBarProps";
import ThemeToggle from "./ThemeToggle";

// NavItem component
interface NavItemProps {
    name: string;
    href: string;
    isActive: boolean;
    eventKey: number;
}
const NavItemComponent: React.FC<NavItemProps> = ({ name, href, isActive, eventKey }) => (
    <Nav.Item>
        <Nav.Link
            eventKey={eventKey}
            as={Link}
            to={href}
            className={isActive ? 'active' : ''}
        >
            {name}
        </Nav.Link>
    </Nav.Item>
);

// NavItemsList component
interface NavItemsListProps {
    navItems: { name: string; href: string }[];
    currentPath: string;
}
const NavItemsList: React.FC<NavItemsListProps> = ({ navItems, currentPath }) => (
    <Nav className="mx-auto">
        {navItems.map((item, idx) => (
            <NavItemComponent
                key={item.href}
                name={item.name}
                href={item.href}
                isActive={currentPath === item.href}
                eventKey={idx}
            />
        ))}
    </Nav>
);

const NavBar: React.FC<NavBarProps> = ({ title, navItems, isDarkMode, collapseOnSelect, setIsDarkMode }) => {
    const location = useLocation();

    return (
        <Navbar
            collapseOnSelect={collapseOnSelect}
            expand="lg"
            bg={isDarkMode ? 'dark' : 'light'}
            variant={isDarkMode ? 'dark' : 'light'}
        >
            <div className="container">
                <NavbarBrand className="mx-auto">{title}</NavbarBrand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" role="">
                    <NavItemsList navItems={navItems} currentPath={location.pathname} />
                    <Nav className="ml-auto">
                        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default NavBar;
