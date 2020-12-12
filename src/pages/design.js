import React from "react"
import "../style/design.css"

const pages = [
    {
        url: "https://vookmark.co/",
    },
]

const Design = () => (
    <main className="design">
        <h1>Design</h1>
        <section>
            {pages.map((page) => (
                <iframe className="design-page" key={page.url} src={page.url} />
            ))}
        </section>
    </main>
)

export default Design
