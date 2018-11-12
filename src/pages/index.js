import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Menu from "../components/Menu";
import { spacing, colors } from "../components/style";

const listStyle = {
    display: "grid",
    grid: "repeat(3, 150px) / repeat(3, 1fr)",
    gridGap: spacing.default,
};

const listItemStyle = {
    fontFamily: "Work Sans",
    fontSize: "32px",
    fontWeight: 700,
    color: colors.primary,
    display: "inline-block",
    border: `2px solid ${colors.primary}`,
    width: "100%",
    height: "150px",
    borderRadius: "3px",
    padding: spacing.default,
};

const Index = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const Posts = edges.map(edge => (
        <a href={edge.node.frontmatter.path} key={edge.node.id}>
            <div style={listItemStyle}>{edge.node.frontmatter.title}</div>
        </a>
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
                    }
                }
            }
        }
    }
`;
