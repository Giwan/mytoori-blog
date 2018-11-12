import React from "react";
import { Link } from "gatsby";
import { colors } from "./style";

const menuStyle = {
    borderBottom: `1px solid ${colors.primary}`,
    marginBottom: "16px",

    link: {
        textTransform: "uppercase",
        textDecoration: "none",
        color: colors.primary,
        fontFamily: "Work Sans",
        fontWeight: 700,
    },
};

const Menu = () => (
    <nav style={menuStyle}>
        <Link style={menuStyle.link} to="/about">
            About
        </Link>
    </nav>
);

export default Menu;
