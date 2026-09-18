import "./globals.css";

export const metadata = {
    title: "Nuzi AI",
    description: "Nuzi AI Assistant",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}