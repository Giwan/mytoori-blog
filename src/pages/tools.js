import React from "react";
import "../style/tools.css";
import Layout from "../components/layout";
import tools from "../data/tools";
// Behance.net, Dribble.com

const ToolsPage = () => (
    <Layout subTitle="tools">
        <article className="mb-tools__container">
            <p>
                Some of the tools I use on a regular basis. These are typically
                the tools I would recommend to others as well.
            </p>

            <section className="mb-tools_list">
                {tools.map((tool) => (
                    <ToolItem key={tool.title + tool.description} tool={tool} />
                ))}
            </section>
        </article>
    </Layout>
);

export default ToolsPage;

/**
 * The tools item. This is basically a page item for that tool.
 *
 */
const ToolItem = ({ tool }) => (
    <article className="mb-tools_item">
        <h2>
            <a href={tool.url}>{tool.title}</a>
        </h2>
        <p>{tool.description}</p>
        <footer>
            {Array.isArray(tool.labels) &&
                tool.labels.map((label) => <label key={label}>{label}</label>)}
        </footer>
    </article>
);
