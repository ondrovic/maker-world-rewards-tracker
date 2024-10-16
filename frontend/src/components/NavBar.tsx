import React from "react";
import { Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import ThemeToggle from "./ThemeToggle";
import { NavBarProps } from "../interfaces/NavBarProps";

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
                    <Nav className="mx-auto">
                        {navItems.map((item, index) => (
                            <Nav.Item key={index}>
                                <Nav.Link 
                                    eventKey={index}
                                    as={Link} 
                                    to={item.href}
                                    className={location.pathname === item.href ? 'active' : ''}
                                >
                                    {item.name}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                    <Nav className="ml-auto">
                        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                    </Nav>
                </Navbar.Collapse>
            </div>
        </Navbar>
    );
};

export default NavBar;
