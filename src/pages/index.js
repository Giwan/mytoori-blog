import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/layout'
import Menu from '../components/Menu'

const Index = ({
    data: {
        allMarkdownRemark: { edges },
    },
}) => {
    const Posts = edges.map(edge => (
        <a href={edge.node.frontmatter.path} key={edge.node.id}>
            {edge.node.frontmatter.title}
        </a>
    ))
    return (
        <Layout>
            <Menu />
            <div>{Posts}</div>
        </Layout>
    )
}

export default Index

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
`
