require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})

const siteMetadata = {
    title: "Mytoori blog",
    author: "Giwan Persaud",
}

/**
 * Access the file system
 * and read markdown pages.
 */
const sourceFileSystem = {
    resolve: `gatsby-source-filesystem`,
    options: {
        path: `${__dirname}/src/posts`,
        name: "markdown-pages",
    },
}

/**
 * Used to read markdown files and transform
 * them properly
 */
const transformerRemark = {
    resolve: `gatsby-transformer-remark`,
    options: {
        plugins: [
            {
                resolve: `gatsby-remark-prismjs`,
                options: {
                    classPrefix: null,
                    showLineNumbers: false,
                },
            },
        ],
    },
}

const googleAnalytics = {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
        trackingId: "UA-75146522-4",
    },
}

/**
 * Read images from the file system
 */
const sourceFilesystem = {
    resolve: `gatsby-source-filesystem`,
    options: {
        name: `images`,
        path: `${__dirname}/src/images`,
    },
}

/**
 * Creates a manifest file for PWA
 */
const pluginManifest = {
    resolve: `gatsby-plugin-manifest`,
    options: {
        name: "gatsby-starter-default",
        short_name: "starter",
        start_url: "/",
        background_color: "#fefefe",
        theme_color: "#212121",
        display: "minimal-ui",
        icon: "src/images/favicon.svg", // This path is relative to the root of the site.
    },
}

module.exports = {
    siteMetadata,
    plugins: [
        sourceFileSystem,
        transformerRemark,
        googleAnalytics,
        "gatsby-plugin-react-helmet",
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        pluginManifest,
        sourceFilesystem,
        `gatsby-plugin-mdx`,
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ],
}
