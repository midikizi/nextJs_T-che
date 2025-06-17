"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants invalides");
      } else {
        router.push("/taches");
        router.refresh();
      }
    } catch (error) {
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Card className="w-full max-w-lg p-10 shadow-2xl flex flex-col items-center justify-center">
        <CardHeader className="w-full flex items-center justify-center">
          <CardTitle className="text-2xl">Connexion</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <form onSubmit={handleSubmit} className="space-y-6 w-full">
            <div>
              <Input
                type="text"
                placeholder="Nom d&apos;utilisateur"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="h-12 text-lg"
                disabled={isLoading}
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </Button>
            <div className="text-center pt-2">
              <span>Pas de compte ? </span>
              <Link href="/register" className="text-blue-600 hover:underline">S&apos;inscrire</Link>
            </div>
          </form>
        </CardContent>
      </Card>
  );
}
