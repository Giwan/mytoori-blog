export const categories = Object.freeze({
    NOTES: "Notes",
    DESIGN: "Design",
    EMAIL: "Email",
    MARKETING: "Marketing",
    PROJECT_MANAGEMENT: "Project Management",
    WRITING: "Writing",
})

export const labels = Object.freeze({
    design: "design",
    inspiration: "inspiration",
    productivity: "productivity",
    education: "education",
    marketing: "marketing",
    leisure: "leisure",
    project: "project",
    management: "management",
    writing: "writing",
    reading: "reading",
})

const tools = [
    {
        title: "Figma",
        url: "https://figma.com",
        description:
            "App great design tool. It's easy to use and especially get started. No installation required for example. Simply fireup your web browser and signup and get started.",
        category: categories.DESIGN,
        labels: [labels.design, labels.productivity],
    },
    {
        title: "Trello",
        url: "https://trello.com",
        description: "A project management tools. Great for new projects.",
        price: 0,
        category: categories.PROJECT_MANAGEMENT,
        labels: [labels.project, labels.management, labels.productivity],
    },
    {
        title: "Google doc",
        url: "https://trello.com",
        description:
            "Document writing. Create documents. If you've used Microsoft Word, this is a capable online alternative from Google.",
        price: 0,
        category: categories.WRITING,
        labels: [labels.productivity, labels.writing],
    },
]

export default tools
