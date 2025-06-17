"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Redirection automatique vers la page de login au chargement
  useEffect(() => {
    router.push("/login");
  }, [router]);

  // Retourne null car la redirection est immédiate
  return null;
}