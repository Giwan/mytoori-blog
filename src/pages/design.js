import React from "react";
import "../style/design.css";

import { designPages as pages } from "../data/pages";

const cloudinaryPrefix = "https://res.cloudinary.com/mytoori/image/upload";

// TODO: use Link for internal links like mytoori.com
// warning in console
const Design = () => (
    <main className="design">
        <h1>Design</h1>
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
);

export default Design;
