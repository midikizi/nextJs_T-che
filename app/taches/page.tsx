"use client";
import { CardHeader, Card, CardTitle, CardContent } from "@/src/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { tacheService } from "@/src/services/TacheService";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

// ... autres imports

export default function Page() {
    // États pour la création d'une nouvelle tâche
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [etat, setEtat] = useState("");
    const [jour, setJour] = useState("");

    // États pour la modification d'une tâche existante
    const [editId, setEditId] = useState<number | null>(null);
    const [editTitre, setEditTitre] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editEtat, setEditEtat] = useState("");
    const [editJour, setEditJour] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    // Requête pour récupérer toutes les tâches
    const query = useQuery({
        queryKey: ["getAllTache"],
        queryFn: async () => {
            return await tacheService.getALL();
        }
    });

    // Mutation pour créer une nouvelle tâche
    const mutation = useMutation({
        mutationFn: tacheService.create,
        onSuccess: () => {
            query.refetch(); // Rafraîchit la liste des tâches
            // Réinitialise les champs du formulaire
            setTitre("");
            setDescription("");
            setEtat("");
            setJour("");
            setCreateOpen(false);
        }
    });

    // Mutation pour mettre à jour une tâche existante
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: 
            { id: number, data: { titre: string, description: string, etat: string, jour: string } }) => tacheService.update(id, data),
        onSuccess: () => {
            query.refetch();
            setEditOpen(false);
        }
    });

    // Mutation pour supprimer une tâche
    const deleteMutation = useMutation({
        mutationFn: (id: number) => tacheService.delete(id),
        onSuccess: () => {
            query.refetch();
        }
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tableau de gestion des tâches</CardTitle>

                {/* Dialogue de création d'une nouvelle tâche */}
                <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default">New</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une nouvelle tâche</DialogTitle>
                            <DialogDescription>
                                Remplissez les informations pour créer une nouvelle tâche
                            </DialogDescription>
                        </DialogHeader>
                        {/* Formulaire de création */}
                        <form className="space-y-4" 
                        onSubmit={e => {e.preventDefault();mutation.mutate({titre,description,etat,jour});}}>
                            {/* Champs du formulaire */}
                            <div className="space-y-2">
                                <Label htmlFor="titre">Titre</Label>
                                <Input id="titre" value={titre} 
                                onChange={e => setTitre(e.target.value)} placeholder="Entrez le titre de la tâche" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" value={description} 
                                onChange={e => setDescription(e.target.value)} placeholder="Entrez la description" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="etat">État</Label>
                                <Select value={etat} onValueChange={setEtat}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez l'état" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en_cours">En cours</SelectItem>
                                        <SelectItem value="en_attente">En attente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="jour">Date</Label>
                                <Input id="jour" type="date" value={jour} onChange={e => setJour(e.target.value)} />
                            </div>
                            {/* Boutons d'action */}
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" type="button" onClick={() => setCreateOpen(false)}>Annuler</Button>
                                <Button type="submit">Créer</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Dialogue de modification d'une tâche */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Modifier la tâche</DialogTitle>
                        </DialogHeader>
                        {/* Formulaire de modification */}
                        <form
                        className="space-y-4"
                        onSubmit={e => {
                            e.preventDefault();
                            if (editId !== null) {
                            updateMutation.mutate({
                                id: editId,
                                data: {
                                titre: editTitre,
                                description: editDescription,
                                etat: editEtat,
                                jour: editJour
                                }
                            });
                            }
                        }}
                        >
                        {/* Champs du formulaire de modification */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-titre">Titre</Label>
                            <Input id="edit-titre" value={editTitre} onChange={e => setEditTitre(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Input id="edit-description" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-etat">État</Label>
                            <Select value={editEtat} onValueChange={setEditEtat}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'état" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en_cours">En cours</SelectItem>
                                <SelectItem value="termine">Terminée</SelectItem>
                                <SelectItem value="en_attente">En attente</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-jour">Date</Label>
                            <Input id="edit-jour" type="date" value={editJour} onChange={e => setEditJour(e.target.value)} />
                        </div>
                        {/* Boutons d'action */}
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>Annuler</Button>
                            <Button type="submit">Enregistrer</Button>
                        </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </CardHeader>
            <CardContent>
                {/* Tableau des tâches */}
                <Table>
                    <TableCaption>liste des dernières taches.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Titre</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Etat</TableHead>
                            <TableHead>Jour</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Affichage des tâches */}
                        {query.data?.data.map((tache) => (
                            <TableRow key={tache.id}>
                                <TableCell>{tache.titre}</TableCell>
                                <TableCell>{tache.description}</TableCell>
                                <TableCell>{tache.etat}</TableCell>
                                <TableCell>{new Date(tache.jour).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    {/* Bouton de modification */}
                                    <Button
                                        onClick={() => {
                                            setEditId(tache.id);
                                            setEditTitre(tache.titre);
                                            setEditDescription(tache.description);
                                            setEditEtat(tache.etat);
                                            setEditJour(tache.jour.slice(0, 10)); // Formatage pour input type="date"
                                            setEditOpen(true);
                                        }}
                                        >
                                        update
                                    </Button>
                                    {/* Bouton de suppression */}
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
                                            deleteMutation.mutate(tache.id);
                                            }
                                        }}
                                        >
                                        delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}