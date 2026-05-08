import { env } from "./env";

async function request(path: string, init: RequestInit = {}) {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  const res = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.supabaseServiceRoleKey,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.status === 204 ? [] : res.json();
}

export const supabaseRest = {
  insert: (table: string, body: unknown) => request(table, { method: "POST", body: JSON.stringify(body) }),
  select: (table: string, query: string) => request(`${table}?${query}`),
  update: (table: string, query: string, body: unknown) => request(`${table}?${query}`, { method: "PATCH", body: JSON.stringify(body) }),
};
