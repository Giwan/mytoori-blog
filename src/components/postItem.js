import React from "react"
import { spacing, colors } from "../components/style"
import { showLongDate } from "../config/helpers"
import "../style/postItem.css";

const listItemStyle = {
    color: colors.primary,
    // backgroundColor: "#3dd9b4",
    // backgroundColor: colors.primary,
    // backgroundColor: "slategray",
    // backgroundColor: "#16a085",
    display: "inline-block",
    // border: `5px solid slategray`,
    width: "100%",
    height: "100%",
    // padding: spacing.default,
    marginBottom: spacing.default * 4,

    title: {
        color: colors.primary,
    },

    link: {
        textDecoration: "none",
    },

    date: {
        textAlign: "right",
        fontSize: "0.8em",
        marginBottom: spacing.default,
        fontFamily: "Helvetica",
        textTransform: "uppercase",
        color: colors.primary,
    },
    summary: {
        color: colors.primary,
        fontSize: "1.1em",
        lineHeight: "1.42em",
    },
}

const PostItem = ({ node }) => {
    return (
        <div style={listItemStyle} className="mb-postItem__container">
            <a href={node.frontmatter.path} style={listItemStyle.link}>
                {/* <img
                    src={node.frontmatter.image}
                    alt={node.frontmatter.image}
                /> */}

                <h2 style={listItemStyle.title}>{node.frontmatter.title}</h2>
                <div className="mb-postItem-date">
                    {showLongDate(node.frontmatter.date)}
                </div>
                <div className="mb-postItem-summary">
                    {/* {node.frontmatter.summary} */}
                    {node.excerpt}
                </div>
            </a>
        </div>
    )
}

export default PostItem