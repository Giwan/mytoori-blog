/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require("path")

exports.createPages = ({ actions, graphql }) => {
    const { createPage } = actions

    const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`)

    return graphql(`
        {
            allMarkdownRemark {
                edges {
                    node {
                        html
                        id
                        frontmatter {
                            path
                            title
                            author
                            date
                            summary
                            image
                            published
                        }
                    }
                }
            }
        }
    `).then(result => {
        if (result.errors) {
            return Promise.reject(result.errors)
        }

        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
            createPage({
                path: node.frontmatter.path,
                component: blogPostTemplate,
                context: {}, // additional data can be passed via context
            })
        })
    })
}
