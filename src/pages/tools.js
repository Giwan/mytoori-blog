import React from "react"
import "../style/about.css"
import Layout from "../components/layout"
import Header from "../components/header"
const AboutPage = () => {
    return (
        <Layout>
            <Header />
            <div className="mb-tools__container">
                <h1>Tools</h1>
                <h2><a href="https://figma.com">Figma</a></h2>
                <p>App prototyping and design tool.</p>
            </div>
        </Layout>
    )
}

export default AboutPage
