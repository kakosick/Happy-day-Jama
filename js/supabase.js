
const config = window.VELVET_CONFIG || {};

if (!window.supabase) {
  console.error("Supabase library is not loaded");
} else if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
  console.error("Supabase URL or API key is missing");
} else {
  window.sb = window.supabase.createClient(
    config.SUPABASE_URL.trim(),
    config.SUPABASE_ANON_KEY.trim()
  );

  console.log("Supabase client initialized:", !!window.sb);
}
