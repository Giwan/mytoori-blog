import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { showLongDate } from "../config/helpers"
import { colors, spacing } from "../components/style"
// import Image from "../components/image";
import "../style/blogPostTemplate.css"

const blogPost = {
    container: {
        margin: `10% auto`,
        maxWidth: 960,
    },

    header: {
        backgroundColor: colors.primary,
        color: colors.primaryLight,
        padding: spacing.default,
        marginBottom: spacing.default * 4,
        title: {
            fontSize: "2.25em",
            color: colors.primaryLight,
        },
        summary: {
            fontSize: "1.5em",
            lineHeight: "1.25em",
            fontWeight: 500,
        },
        date: {
            color: colors.primaryLight,
            textAlign: "right",
            borderBottom: `1px solid ${colors.primaryLight}`,
            marginBottom: spacing.default,
        },
    },

    content: {
        fontSize: 22,
        lineHeight: "1.6em",
    },
}

export default function Template({
    data, // this prop will be injected by the GraphQL query below.
}) {
    const { markdownRemark = {} } = data // data.markdownRemark holds our post data
    const { frontmatter, html } = markdownRemark
    return (
        <Layout>
            <div style={blogPost.container}>
                <article className="md-post--container">
                    <header className="md-post--header">
                        <h1>{frontmatter.title}</h1>

                        <p className="md-post--date">
                            {showLongDate(frontmatter.date)} -{" "}
                            {frontmatter.author}
                        </p>
                        <p>{frontmatter.summary}</p>
                    </header>
                    <main
                        className="md-post--content"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </article>
            </div>
        </Layout>
    )
}

export const pageQuery = graphql`
    query($path: String!) {
        markdownRemark(frontmatter: { path: { eq: $path } }) {
            html
            frontmatter {
                path
                date
                title
                author
                image
                summary
            }
        }
    }
`
