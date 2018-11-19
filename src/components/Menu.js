import React from "react";
import { Link } from "gatsby";
import { colors, font, spacing } from "./style";

const menuStyle = {
    borderBottom: `8px solid ${colors.primary}`,
    textAlign: "right",
    marginBottom: spacing.default,

    link: {
        textTransform: "uppercase",
        textDecoration: "none",
        color: colors.primary,
        fontFamily: font.family,
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
