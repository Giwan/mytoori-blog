import React from "react";
import { Link } from "gatsby";
import { colors, font, spacing } from "./style";

const menuStyle = {
    // borderBottom: `1px solid ${colors.primary}`,
    backgroundColor: colors.primary,
    marginBottom: spacing.default,
    padding: `0 ${spacing.default}`,
    textAlign: "right",

    link: {
        textTransform: "uppercase",
        textDecoration: "none",
        color: colors.primaryLight,
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
