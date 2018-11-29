import React from "react"
import { Link } from "gatsby"
import { colors, font } from "./style"

const Header = ({ siteTitle }) => (
    <div
        style={{
            background: "transparent",
            // marginBottom: "1.45rem",
        }}
    >
        <div
            style={{
                margin: "0 auto",
                maxWidth: 960,
                padding: "1.45rem 1.0875rem",
                paddingBottom: 0,
            }}
        >
            <h1 style={{ margin: 0 }}>
                <Link
                    to="/"
                    style={{
                        color: colors.primary,
                        textDecoration: "none",
                        fontFamily: font.family,
                    }}
                >
                    {siteTitle}
                </Link>
            </h1>
        </div>
    </div>
)

export default Header
