import React from "react"
import { Link } from "gatsby"
import { colors, font, spacing } from "./style"

const menuItems = [
    {
        label: "Mytoori.com",
        target: "https://mytoori.com",
    },
    {
        label: "tools",
        target: "/tools",
    },
    {
        label: "Design",
        target: "/design",
    },
    {
        label: "about",
        target: "/about",
    },
]

const Menu = () => (
    <nav className="mb-menu">
        {menuItems.map((item) => (
            <Link key={item.label} className="mb-menu-link" to={item.target}>
                {item.label}
            </Link>
        ))}
    </nav>
)

export default Menu
