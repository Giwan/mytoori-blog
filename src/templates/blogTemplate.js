import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";

const blogPostContainer = {
    margin: `10% auto`,
    maxWidth: 960,
};

const blogPostContentStyle = {
    fontSize: 22,
};

export default function Template({
    data, // this prop will be injected by the GraphQL query below.
}) {
    const { markdownRemark = {} } = data; // data.markdownRemark holds our post data
    const { frontmatter, html } = markdownRemark;
    return (
        <Layout>
            <div style={blogPostContainer}>
                <div className="blog-post">
                    <h1>{frontmatter.title}</h1>
                    <h2>{frontmatter.date}</h2>
                    <div
                        style={blogPostContentStyle}
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>
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
            }
        }
    }
`;
