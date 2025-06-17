const API_URL = "http://127.0.0.1:8000/users/login/";

export async function login({ username, password }: {
  username: string;
  password: string;
}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.token) {
    throw new Error(data.detail || "Identifiants invalides");
  }
  return data; // { token, user: { ... } }
}
