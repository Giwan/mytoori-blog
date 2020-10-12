import React from "react"
import "./cells.css"

const cellItems = [
    {
        title: "title 1",
        value: "some value 1",
    },
    {
        title: "title 2",
        value: "some value 2",
    },
    {
        title: "title 3",
        value: "some value 3",
    },
]

const Cells = () => {
    return (
        <main>
            {cellItems.map(cell => (
                <section key={cell.title}>{cell.value}</section>
            ))}
        </main>
    )
}

export default Cells
