export const generateColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return {
        bg: `hsl(${h}, 70%, 95%)`,
        text: `hsl(${h}, 70%, 30%)`,
        border: `hsl(${h}, 70%, 85%)`,
        selected: `hsl(${h}, 70%, 45%)`
    };
};