export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
};

export function assertServerEnv() {
  const missing = [
    !env.supabaseUrl && "NEXT_PUBLIC_SUPABASE_URL",
    !env.supabaseServiceRoleKey && "SUPABASE_SERVICE_ROLE_KEY",
    !env.openaiApiKey && "OPENAI_API_KEY",
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(`누락된 환경 변수: ${missing.join(", ")}`);
  }
}
