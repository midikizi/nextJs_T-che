"use client";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";

// Exemple de données statiques (à remplacer par un fetch si besoin)
const citations = [
  { id: "1", auteur: "Albert Einstein", texte: "La vie, c'est comme une bicyclette, il faut avancer pour ne pas perdre l'équilibre." },
  { id: "2", auteur: "Oscar Wilde", texte: "Soyez vous-même, les autres sont déjà pris." },
];

export default function CitationDetailPage() {
  const params = useParams();
  const { id } = params;
  const citation = citations.find(c => c.id === id);

  if (!citation) {
    return <div className="text-red-500">Citation introuvable</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Détail de la citation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <span className="font-semibold">Auteur :</span> {citation.auteur}
        </div>
        <div>
          <span className="font-semibold">Texte :</span> {citation.texte}
        </div>
      </CardContent>
    </Card>
  );
} 