export const formatDate = (date: string, optionProps?: Intl.DateTimeFormatOptions) => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        ...optionProps
    };
    return new Date(date).toLocaleDateString("id-ID", options);
};