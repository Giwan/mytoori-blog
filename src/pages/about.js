import React from "react"
import "../style/about.css"
import Layout from "../components/layout"
import Header from "../components/header"
const AboutPage = () => {
    return (
        <Layout>
            <Header />

            <div className="mb-about__container">
                <h1>Giwan Persaud</h1>
                <p>Just my corner of the web where I write about tech.</p>
                <p>
                    As a front-end developer I try to keep learning all the
                    time. When I picked up React at the end of 2015 I really
                    started to accelerate. Since then I have built a mobile
                    version of the existing news reader, a chrome extension
                    using react, created various static sites using Jekyll and
                    Gatsby, etc. If you read through some of the posts of the
                    sites you'll come accross the various technologies I have
                    seen, used or dare I say mastered.
                </p>
            </div>
        </Layout>
    )
}

export default AboutPage
