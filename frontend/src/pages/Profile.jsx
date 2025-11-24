import React, { useEffect, useState } from "react";
import BigHeader from "../components/ui/BigHeader";
import { api } from "../api";
import { useAuth } from "../Context/AuthContext";

export default function Profile() {
    const { user, setUser } = useAuth();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        email: "",
        avatar: "",
    });

    const [loading, setLoading] = useState(true);
    const [avatarPreview, setAvatarPreview] = useState("");

    // LOAD PROFILE
    useEffect(() => {
        async function load() {
            const res = await api.get("/profile");
            setForm(res.data);
            setAvatarPreview(`http://localhost:5000/uploads/${res.data.avatar}`);
            setLoading(false);
        }
        load();
    }, []);

    function update(key, val) {
        setForm((f) => ({ ...f, [key]: val }));
    }

    async function save() {
        await api.put("/profile", form);
        alert("Profile updated");
    }

    async function updatePassword() {
        const currentPassword = prompt("Enter current password:");
        const newPassword = prompt("Enter new password:");

        const res = await api.put("/profile/password", {
            currentPassword,
            newPassword,
        });

        alert(res.data.message);
    }

    async function handleAvatar(e) {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarPreview(URL.createObjectURL(file));

        const fd = new FormData();
        fd.append("avatar", file);

        const res = await api.post("/profile/avatar", fd);

        setForm((f) => ({ ...f, avatar: res.data.avatar }));
    }

    if (loading) return <p className="p-10">Loading...</p>;

    return (
        <div className="p-8">
            <BigHeader title="My Profile" subtitle="Manage your account settings" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">

                {/* LEFT: Details */}
                <div className="bg-white p-6 rounded-xl shadow">

                    <label className="text-sm text-slate-500">Full Name</label>
                    <input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <label className="text-sm text-slate-500">Phone</label>
                    <input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <label className="text-sm text-slate-500">Address</label>
                    <input
                        value={form.address}
                        onChange={(e) => update("address", e.target.value)}
                        className="w-full border p-2 rounded mb-4"
                    />

                    <label className="text-sm text-slate-500">Email</label>
                    <input
                        value={form.email}
                        disabled
                        className="w-full border p-2 rounded bg-slate-100 mb-4"
                    />

                    <button
                        onClick={save}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>
                </div>

                {/* RIGHT: Avatar + Change Password */}
                <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">

                    {/* Avatar */}
                    <img
                        src={avatarPreview}
                        alt="avatar"
                        className="w-32 h-32 rounded-full object-cover border mb-4"
                    />

                    <input type="file" onChange={handleAvatar} className="mb-4" />

                    <button
                        onClick={updatePassword}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>
    );
}
