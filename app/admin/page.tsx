"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

// --- API helpers ---
const fetchUsers = async (token: string) => {
    const res = await fetch("http://localhost:8000/users/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Erreur lors du fetch des utilisateurs");
    return res.json();
};

const updateUser = async (id: number, data: any, token: string) => {
    const res = await fetch(`http://localhost:8000/users/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");
    return res.json();
};

const deleteUser = async (id: number, token: string) => {
    const res = await fetch(`http://localhost:8000/users/${id}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression");
    return true;
};

// --- Composant principal ---
export default function AdminPage() {
    const { data: session } = useSession();
    const token = session?.accessToken;

    // Pour l'édition
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ username: "", email: "", password: "", role: "user" });

    // GET
    const { data: users, refetch, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers(token),
        enabled: !!token,
    });

    // PUT
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => updateUser(id, data, token),
        onSuccess: () => {
            setEditId(null);
            refetch();
        },
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteUser(id, token),
        onSuccess: () => refetch(),
    });

    // UI
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading && <div>Chargement...</div>}
                <table className="min-w-full text-sm border">
                    <thead>
                        <tr className="bg-muted">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nom d'utilisateur</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Rôle</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user: any) => (
                            <tr key={user.id}>
                                <td className="p-2 border">{user.id}</td>
                                <td className="p-2 border">
                                    {editId === user.id ? (
                                        <Input
                                            value={editData.username}
                                            onChange={e => setEditData({ ...editData, username: e.target.value })}
                                        />
                                    ) : (
                                        user.username
                                    )}
                                </td>
                                <td className="p-2 border">
                                    {editId === user.id ? (
                                        <Input
                                            value={editData.email}
                                            onChange={e => setEditData({ ...editData, email: e.target.value })}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td className="p-2 border">
                                    {editId === user.id ? (
                                        <Input
                                            value={editData.role}
                                            onChange={e => setEditData({ ...editData, role: e.target.value })}
                                        />
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td className="p-2 border flex gap-2">
                                    {editId === user.id ? (
                                        <>
                                            <Input
                                                type="password"
                                                placeholder="Nouveau mot de passe"
                                                value={editData.password}
                                                onChange={e => setEditData({ ...editData, password: e.target.value })}
                                                className="w-36"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => updateMutation.mutate({ id: user.id, data: editData })}
                                            >
                                                Enregistrer
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                                                Annuler
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="sm" onClick={() => {
                                                setEditId(user.id);
                                                setEditData({ username: user.username, email: user.email, password: "", role: user.role });
                                            }}>
                                                Modifier
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => deleteMutation.mutate(user.id)}
                                            >
                                                Supprimer
                                            </Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
} 