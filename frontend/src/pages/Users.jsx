import React, { useEffect, useState } from "react";
import BigHeader from "../components/ui/BigHeader";
import { api } from "../api";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const res = await api.get("/users");
        setUsers(res.data);
    }

    async function deleteUser(id) {
        if (!window.confirm("Delete this user?")) return;
        await api.delete(`/users/${id}`);
        loadUsers();
    }

    async function makeAdmin(id) {
        await api.put(`/users/make-admin/${id}`);
        loadUsers();
    }

    return (
        <div className="p-8">
            <BigHeader title="User Management" subtitle="Manage user roles and accounts" />

            <div className="bg-white rounded-2xl shadow p-6 mt-6">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-500 text-sm border-b">
                            <th className="py-3">Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-b hover:bg-slate-50">
                                <td className="py-3 font-medium">{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>

                                <td className="text-right space-x-2">
                                    {u.role !== "admin" && (
                                        <button
                                            onClick={() => makeAdmin(u.id)}
                                            className="px-3 py-1 border rounded-md text-xs"
                                        >
                                            Make Admin
                                        </button>
                                    )}

                                    <button
                                        onClick={() => deleteUser(u.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md text-xs"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
