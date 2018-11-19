import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { showLongDate } from "../config/helpers";
import { colors } from "../components/style";
// import Image from "../components/image";

const blogPost = {
    container: {
        margin: `10% auto`,
        maxWidth: 960,
    },

    content: {
        fontSize: 22,
        lineHeight: "1.6em",
    },

    date: {
        color: colors.primary,
    },
};

export default function Template({
    data, // this prop will be injected by the GraphQL query below.
}) {
    const { markdownRemark = {} } = data; // data.markdownRemark holds our post data
    const { frontmatter, html } = markdownRemark;
    return (
        <Layout>
            <div style={blogPost.container}>
                <article className="blog-post">
                    <h1>{frontmatter.title}</h1>
                    <div style={blogPost.date}>
                        {showLongDate(frontmatter.date)} - {frontmatter.author}
                    </div>
                    <article
                        style={blogPost.content}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </article>
            </div>
        </Layout>
    );
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
            }
        }
    }
`;
