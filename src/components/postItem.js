import React from "react"
import { spacing, colors } from "../components/style"
import { showLongDate } from "../config/helpers"

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
    marginBottom: spacing.default,

    title: {
        color: colors.primary,
    },

    date: {
        textAlign: "right",
        fontSize: "0.8em",
        marginBottom: spacing.default,
        borderBottom: `10px solid lightgray`,
        fontFamily: "Helvetica",
        textTransform: "uppercase",
        color: colors.primary,
    },
    summary: {
        color: colors.primary,
        fontSize: "1.2em",
        lineHeight: "1.42em",
    },
}

const PostItem = ({ node }) => {
    return (
        <a href={node.frontmatter.path}>
            <div style={listItemStyle}>
                {/* <img
                    src={node.frontmatter.image}
                    alt={node.frontmatter.image}
                /> */}

                <h1 style={listItemStyle.title}>{node.frontmatter.title}</h1>
                <div style={listItemStyle.date}>
                    {showLongDate(node.frontmatter.date)}
                </div>
                <div style={listItemStyle.summary}>
                    {node.frontmatter.summary}
                </div>
            </div>
        </a>
    )
}

export default PostItem

/*

<Image
    url={node.frontmatter.image}
    alt={node.frontmatter.image}
    data-test={node.frontmatter.image}
/>

 */
