import React from "react"
import { Link } from "gatsby"
import { colors, font, spacing } from "./style"

const menuStyle = {
    // borderBottom: `20px solid lightgray`,
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

const menuItems = [
    {
        label: "Mytoori.com",
        target: "https://mytoori.com"
    },
    {
        label: "tools",
        target: "/tools"
    },
    {
        label: "about",
        target: "/about"
    }
]

const Menu = () => (
    <nav style={menuStyle}>
        {menuItems.map(item => <Link key={item.label} style={menuStyle.link} to={item.target}>
            {item.label}
        </Link>)}
    </nav>
)

export default Menu
