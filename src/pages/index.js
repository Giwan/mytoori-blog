import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Menu from "../components/menu"
import PostItem from "../components/postItem"
import "../style/index.css"

const Index = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const Posts = edges.map(({ node }) => (
        <PostItem key={node.id} node={node} />
    ))
    return (
        <Layout>
            <Menu />
            <div className="mb-posts__container">{Posts}</div>
        </Layout>
    )
}

export default Index

export const pageQuery = graphql`
    query {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
`
