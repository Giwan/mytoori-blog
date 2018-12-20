import React from "react"
// import { Link } from "gatsby"
import Menu from "../components/menu"
import Layout from "../components/layout"
import { StaticQuery, graphql } from "gatsby"

const ToolsPage = () => (
    <StaticQuery
        query={graphql`
            {
                allAirtable {
                    edges {
                        node {
                            data {
                                Name
                                Description
                            }
                        }
                    }
                }
            }
        `}
        render={({ allAirtable: { edges } }) => (
            <Layout>
                <Menu />
                <h1>Recommended front-end tools</h1>
                <div>
                    {edges.map(({ node: { data } }, i) => (
                        <div key={data.Name + i}>{data.Name}</div>
                    ))}
                </div>
            </Layout>
        )}
    />
)

export default ToolsPage
