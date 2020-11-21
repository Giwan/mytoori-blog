import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"
import Header from "./header"
import "../style/layout.css"
import { meta } from "../config/helpers"
import Menu from "./mainMenu"

const Layout = ({ children }) => (
    <StaticQuery
        query={graphql`
            query SiteTitleQuery {
                site {
                    siteMetadata {
                        title
                    }
                }
            }
        `}
        render={(data) => (
            <main className="mainContainer">
                <Helmet title={data.site.siteMetadata.title} meta={meta}>
                    <html lang="en" />
                </Helmet>
                <div className="mb-header__container">
                    <Header siteTitle={data.site.siteMetadata.title} />
                    <Menu />
                </div>
                <>{children}</>
            </main>
        )}
    />
)

Layout.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Layout
