import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Menu from "../components/Menu";
import PostItem from "../components/postItem";

import { spacing, colors } from "../components/style";

const listStyle = {
    display: "grid",
    grid: "repeat(3, 150px) / repeat(3, 1fr)",
    gridGap: spacing.default,
};

const Index = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const Posts = edges.map(({ node }) => (
        <PostItem key={node.id} node={node} />
    ));
    return (
        <Layout>
            <Menu />
            <div style={listStyle}>{Posts}</div>
        </Layout>
    );
};

export default Index;

export const pageQuery = graphql`
    query {
        allMarkdownRemark {
            edges {
                node {
                    id
                    frontmatter {
                        path
                        title
                        author
                        date
                        summary
                        image
                    }
                }
            }
        }
    }
`;
