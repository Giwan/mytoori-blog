import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Menu from "../components/Menu";
import { spacing, colors } from "../components/style";
import { showLongDate } from "../config/helpers";

const listStyle = {
    display: "grid",
    grid: "repeat(3, 150px) / repeat(3, 1fr)",
    gridGap: spacing.default,
};

const listItemStyle = {
    color: colors.primary,
    display: "inline-block",
    border: `2px solid ${colors.primary}`,
    width: "100%",
    height: "350px",
    borderRadius: "3px",
    padding: spacing.default,
};

const Index = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const Posts = edges.map(({ node }) => (
        <a href={node.frontmatter.path} key={node.id}>
            <div style={listItemStyle}>
                <h1>{node.frontmatter.title}</h1>
                <div>{showLongDate(node.frontmatter.date)}</div>
                <div>{node.frontmatter.summary}</div>
            </div>
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
                        author
                        date
                        summary
                    }
                }
            }
        }
    }
`;
