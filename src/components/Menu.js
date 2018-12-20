import React from "react"
import { Link } from "gatsby"
import { colors, font, spacing } from "./style"

const menuStyle = {
    borderBottom: `20px solid lightgray`,
    textAlign: "right",
    marginBottom: spacing.default * 2,

    link: {
        textTransform: "uppercase",
        textDecoration: "none",
        color: colors.primary,
        fontFamily: font.family,
        fontWeight: 700,
        marginLeft: spacing.default,
    },
}

const Menu = () => (
    <nav style={menuStyle}>
        <Link style={menuStyle.link} to="/about">
            About
        </Link>
        <Link style={menuStyle.link} to="/tools">
            Tools
        </Link>
    </nav>
)

export default Menu
