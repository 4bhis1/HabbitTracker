/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--bg-color)",
                surface: "var(--surface-color)",
                primary: "var(--primary-color)",
                danger: "var(--danger-color)",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"), // Just in case, though standard doesn't have it by default without install. I will remove it if it fails or install it.
    ],
}
