import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";
import Header from "./header";
import "../style/layout.css";
import { metaData } from "../config/helpers";
import Menu from "./mainMenu";

const Layout = ({ children, subTitle, className }) => (
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
            <main className={className}>
                <Helmet title={data.site.siteMetadata.title} meta={metaData}>
                    <html lang="en" />
                </Helmet>
                <div className="mb-header__container">
                    <Header subTitle={subTitle} />
                    <Menu />
                </div>
                <>{children}</>
            </main>
        )}
    />
);

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
