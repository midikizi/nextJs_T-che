const API_URL = "http://127.0.0.1:8000/users/register/";

export async function register({ username, email, password, role }: {
  username: string;
  email: string;
  password: string;
  role: string;
}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Erreur lors de l'inscription");
  }
  return await res.json();
}
