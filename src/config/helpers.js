export const showLongDate = dateString => {
    const newDate = new Date(dateString);
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
    };
    return newDate.toLocaleDateString("en-GB", options);
};

export const metaData = [
    {
        name: "description",
        content:
            "Some concepts I needed to tackle when building mytoori.com",
    },
    {
        name: "keywords",
        content: "language, learning, gatsby",
    },
    {
        name: "google-site-verification",
        content:
            "eRYYDNUPf4nUZqzkjmprA4-GyqJ78eBhvAkWBaGzzck",
    },
]
