const _c = window.VELVET_CONFIG || {};
const sb = (window.supabase && _c.SUPABASE_URL && _c.SUPABASE_ANON_KEY)
  ? window.supabase.createClient(_c.SUPABASE_URL, _c.SUPABASE_ANON_KEY) : null;
