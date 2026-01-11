import UserNavbar from "./UserNavbar";

export default function UserLayout({ children }) {
    return (
        <div style={page}>
            <UserNavbar />
            <div style={content}>{children}</div>
        </div>
    );
}

/* ---------- STYLES ---------- */
const page = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
};

const content = {
    padding: "40px",
};
