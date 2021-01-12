require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

const siteMetadata = {
    title: "Mytoori blog",
    author: "Giwan Persaud",
};

/**
 * Access the file system
 * and read markdown pages.
 */
const sourceFileSystemPosts = {
    resolve: `gatsby-source-filesystem`,
    options: {
        name: "posts",
        path: `${__dirname}/src/posts/`,
    },
};

const sourceFileSystemPages = {
    resolve: `gatsby-source-filesystem`,
    options: {
        name: "pages",
        path: `${__dirname}/src/pages/`,
    },
};

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
                    showLineNumbers: true,
                },
            },
        ],
    },
};

const googleAnalytics = {
    resolve: `gatsby-plugin-google-analytics`,
    options: {
        trackingId: "UA-75146522-4",
    },
};

/**
 * Read images from the file system
 */
const sourceFilesystemImages = {
    resolve: `gatsby-source-filesystem`,
    options: {
        name: `images`,
        path: `${__dirname}/src/images`,
    },
};

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
};

const gatsbyPlugMdx = {
    resolve: `gatsby-plugin-mdx`,
    options: {
        extensions: [".mdx", ".md"],
        defaultLayouts: {
            pages: require.resolve("./src/templates/blogTemplate.js"),
            default: require.resolve("./src/templates/blogTemplate.js"),
        },
    },
};

module.exports = {
    siteMetadata,
    plugins: [
        sourceFileSystemPosts,
        sourceFileSystemPages,
        transformerRemark,
        googleAnalytics,
        "gatsby-plugin-react-helmet",
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/pages`,
            },
        },
        pluginManifest,
        sourceFilesystemImages,
        gatsbyPlugMdx,

        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.app/offline
        // 'gatsby-plugin-offline',
    ],
};
