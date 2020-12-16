import React from "react"
import { showLongDate } from "../config/helpers"
import "../style/postItem.css"

const PostItem = ({ node }) => (
    <div className="mb-postItem__container">
        <a href={node.frontmatter.path}>
            {/* <img
                    src={node.frontmatter.image}
                    alt={node.frontmatter.image}
                /> */}
            <div className="mb-postItem-title">
                <h2>{node.frontmatter.title}</h2>
            </div>
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

export default PostItem
