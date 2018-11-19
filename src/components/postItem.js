import React from "react";
import { spacing, colors } from "../components/style";
import { showLongDate } from "../config/helpers";

const listItemStyle = {
    backgroundColor: colors.primary,
    color: colors.primaryLight,
    display: "inline-block",
    border: `2px solid ${colors.primary}`,
    width: "100%",
    padding: spacing.default,
    marginBottom: spacing.default,
};

const PostItem = ({ node }) => {
    return (
        <a href={node.frontmatter.path}>
            <div style={listItemStyle}>
                <img
                    src={node.frontmatter.image}
                    alt={node.frontmatter.image}
                />

                <h1>{node.frontmatter.title}</h1>
                <div>{showLongDate(node.frontmatter.date)}</div>
                <div>{node.frontmatter.summary}</div>
            </div>
        </a>
    );
};

export default PostItem;

/*

<Image
    url={node.frontmatter.image}
    alt={node.frontmatter.image}
    data-test={node.frontmatter.image}
/>

 */
