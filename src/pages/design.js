import React from "react";
import "../style/design.css";
import { designPages as pages } from "../data/pages";
import Layout from "../components/layout";

const cloudinaryPrefix = "https://res.cloudinary.com/mytoori/image/upload";

// TODO: use Link for internal links like mytoori.com
// warning in console
const Design = () => (
    <Layout subTitle="design" className="designContainer">
        <main className="design">
            <section>
                {pages.map((page) => (
                    <a
                        key={page.url}
                        href={page.url}
                        target="_blank"
                        rel="norel noreferrer"
                        alt={page.description}
                    >
                        <img
                            className="design-page"
                            alt={`${page.url} landing page - ${page.description}`}
                            src={`${cloudinaryPrefix}${page.imgName}`}
                        />
                    </a>
                ))}
            </section>
        </main>
    </Layout>
);

export default Design;
