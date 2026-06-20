import { useState } from "react";
import UserLayout from "../components/UserLayout";

export default function UserProfile() {
    const user = JSON.parse(localStorage.getItem("ix_user"));

    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaving(true);
        setSaved(false);

        setTimeout(() => {
            const updatedUser = { ...user, name };
            localStorage.setItem("ix_user", JSON.stringify(updatedUser));
            setSaving(false);
            setSaved(true);

            setTimeout(() => setSaved(false), 2000);
        }, 1200);
    };

    return (
        <UserLayout>
            {/* HEADER */}
            <div style={header}>
                <h1 style={title}>Account Settings</h1>
                <p style={subtitle}>Manage your profile & preferences</p>
            </div>

            {/* MAIN GRID */}
            <div style={grid}>
                {/* PROFILE CARD */}
                <div style={card}>
                    <div style={avatarWrap}>
                        <div style={avatarGlow} />
                        <div style={avatar}>
                            {name?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>

                    <h3 style={userName}>{name}</h3>
                    <p style={userEmail}>{email}</p>

                    <button style={uploadBtn}>Change Avatar</button>
                </div>

                {/* FORM CARD */}
                <div style={formCard}>
                    <h3 style={sectionTitle}>Profile Information</h3>

                    <div style={field}>
                        <label style={label}>Full Name</label>
                        <input
                            style={input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div style={field}>
                        <label style={label}>Email</label>
                        <input style={inputDisabled} value={email} disabled />
                    </div>

                    <div style={actions}>
                        <button
                            style={{
                                ...saveBtn,
                                opacity: saving ? 0.7 : 1,
                            }}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        {saved && <span style={savedText}>✔ Saved</span>}
                    </div>
                </div>
            </div>

            {/* SECURITY SECTION */}
            <div style={securityCard}>
                <h3 style={sectionTitle}>Security</h3>
                <p style={securityText}>
                    Password management & account security options will be available here.
                </p>

                <button style={dangerBtn}>Change Password</button>
            </div>
        </UserLayout>
    );
}

/* ---------------- STYLES ---------------- */

const header = {
    marginBottom: "36px",
};

const title = {
    fontSize: "34px",
    fontWeight: "800",
    color: "#ffffff",
};

const subtitle = {
    color: "#c7d2fe",
    marginTop: "6px",
};

const grid = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "28px",
    marginBottom: "40px",
};

const card = {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    borderRadius: "22px",
    padding: "32px",
    textAlign: "center",
};

const avatarWrap = {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 16px",
};

const avatarGlow = {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#6366f1,#22c55e)",
    filter: "blur(16px)",
    opacity: 0.7,
};

const avatar = {
    position: "relative",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "#020617",
    border: "2px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    fontWeight: "800",
    color: "#ffffff",
};

const userName = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
};

const userEmail = {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "18px",
};

const uploadBtn = {
    padding: "8px 14px",
    borderRadius: "10px",
    border: "none",
    background: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    cursor: "pointer",
};

const formCard = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(16px)",
    borderRadius: "22px",
    padding: "32px",
};

const sectionTitle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "20px",
};

const field = {
    marginBottom: "18px",
};

const label = {
    display: "block",
    fontSize: "13px",
    color: "#c7d2fe",
    marginBottom: "6px",
};

const input = {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#020617",
    color: "#ffffff",
    outline: "none",
};

const inputDisabled = {
    ...input,
    opacity: 0.6,
};

const actions = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
};

const saveBtn = {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#4f46e5)",
    color: "#ffffff",
    fontWeight: "700",
    cursor: "pointer",
};

const savedText = {
    color: "#22c55e",
    fontWeight: "600",
};

const securityCard = {
    background: "rgba(255,255,255,0.06)",
    borderRadius: "22px",
    padding: "28px",
};

const securityText = {
    color: "#94a3b8",
    marginBottom: "18px",
};

const dangerBtn = {
    padding: "10px 16px",
    borderRadius: "12px",
    border: "none",
    background: "#7f1d1d",
    color: "#fecaca",
    fontWeight: "700",
    cursor: "pointer",
};
