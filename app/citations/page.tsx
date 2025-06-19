"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import CitationService from "@/src/services/citationService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Typecitation } from "@/types/Typecitation";
import { useSession } from "next-auth/react";

export default function CitationsPage() {
  const { data: session, status } = useSession();
  const [texte, setTexte] = useState("");
  const [auteur, setAuteur] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editAuteur, setEditAuteur] = useState("");
  const [editTexte, setEditTexte] = useState("");

  const query = useQuery({
    queryKey: ["citations"],
    queryFn: async () => {
      try {
        const response = await CitationService.getALL();
        return response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des citations:", error);
        throw error;
      }
    },
    enabled: status === "authenticated"
  });

  const mutation = useMutation({
    mutationFn: (data: Typecitation) => CitationService.create(data),
    onSuccess: () => {
      query.refetch();
      setTexte("");
      setAuteur("");
    },
    onError: (error) => {
      console.error("Erreur lors de la création de la citation:", error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Typecitation }) => 
      CitationService.update(id, data),
    onSuccess: () => {
      query.refetch();
      setEditId(null);
      setEditAuteur("");
      setEditTexte("");
    },
    onError: (error) => {
      console.error("Erreur lors de la modification de la citation:", error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => CitationService.delete(id),
    onSuccess: () => {
      query.refetch();
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la citation:", error);
    }
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (auteur && texte) {
      mutation.mutate({ auteur, texte });
    }
  };

  const handleEdit = (citation: Typecitation) => {
    if (citation.id) {
      setEditId(citation.id);
      setEditAuteur(citation.auteur);
      setEditTexte(citation.texte);
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId && editAuteur && editTexte) {
      updateMutation.mutate({
        id: editId,
        data: { auteur: editAuteur, texte: editTexte }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette citation ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (query.isLoading) return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">Chargement des citations...</div>
      </CardContent>
    </Card>
  );

  if (query.isError) return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-red-500">
          Une erreur est survenue lors du chargement des citations. Veuillez réessayer.
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des citations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="mb-6 space-y-2">
          {query.data?.map((citation) => (
            <li key={citation.id} className="border-b pb-2 flex justify-between items-center">
              <div>
                <span className="font-semibold">{citation.auteur} :</span> {citation.texte}
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(citation)}>
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" onClick={() => citation.id && handleDelete(citation.id)}>
                  Supprimer
                </Button>
              </div>
            </li>
          ))}
        </ul>

        {editId ? (
          <form onSubmit={handleUpdate} className="flex gap-2 items-end">
            <Input
              placeholder="Auteur"
              value={editAuteur}
              onChange={e => setEditAuteur(e.target.value)}
              className="w-40"
              required
            />
            <Input
              placeholder="Citation"
              value={editTexte}
              onChange={e => setEditTexte(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit">Modifier</Button>
            <Button type="button" variant="outline" onClick={() => {
              setEditId(null);
              setEditAuteur("");
              setEditTexte("");
            }}>
              Annuler
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAdd} className="flex gap-2 items-end">
            <Input
              placeholder="Auteur"
              value={auteur}
              onChange={e => setAuteur(e.target.value)}
              className="w-40"
              required
            />
            <Input
              placeholder="Citation"
              value={texte}
              onChange={e => setTexte(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit">Ajouter</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 