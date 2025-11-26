tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#FF4500",
                secondary: "#FFD700",
                "background-light": "#f5f6f8",
                "background-dark": "#0A0A0A",
            },
            fontFamily: {
                display: ["Space Grotesk", "sans-serif"],
                mono: ["Roboto Mono", "monospace"],
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px",
            },
        },
    },
};