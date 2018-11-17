import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { showLongDate } from "../config/helpers";
import Image from "../components/image";

const blogPostContainer = {
    margin: `10% auto`,
    maxWidth: 960,
};

const blogPostContentStyle = {
    fontSize: 22,
    lineHeight: "1.6em",
};

export default function Template({
    data, // this prop will be injected by the GraphQL query below.
}) {
    const { markdownRemark = {} } = data; // data.markdownRemark holds our post data
    const { frontmatter, html } = markdownRemark;
    return (
        <Layout>
            <div style={blogPostContainer}>
                <article className="blog-post">
                    <h1>{frontmatter.title}</h1>
                    <h2>
                        {showLongDate(frontmatter.date)} - {frontmatter.author}
                    </h2>
                    <article
                        style={blogPostContentStyle}
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
