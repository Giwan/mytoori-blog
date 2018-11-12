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
