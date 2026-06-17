import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function isValidSupabaseUrl(url) {
  if (typeof url !== 'string') {
    return false
  }

  try {
    const parsedUrl = new URL(url)

    return parsedUrl.protocol === 'https:' && parsedUrl.hostname.endsWith('.supabase.co')
  } catch {
    return false
  }
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(supabaseUrl) &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim(),
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
