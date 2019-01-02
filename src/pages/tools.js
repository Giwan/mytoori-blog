import React from "react"
// import { Link } from "gatsby"
import Menu from "../components/menu"
import Layout from "../components/layout"
import { StaticQuery, graphql } from "gatsby"
import "../style/tools.css"

const ToolsPageRender = ({ allAirtable: { edges } }) => (
    <Layout>
        <Menu />
        <h1>Recommended tools</h1>
        <p>A list of good tools for various tasks.</p>
        <div className="mb-tools-list__container">
            {edges.map(({ node: { data } }, i) => (
                <div key={data.Name + i}>
                    <a
                        href={`https://${data.Name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h3>{data.Name}</h3>
                    </a>
                    <p>{data.Description}</p>
                </div>
            ))}
        </div>
    </Layout>
)

const query = graphql`
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
`

const ToolsPage = () => <StaticQuery query={query} render={ToolsPageRender} />

export default ToolsPage
