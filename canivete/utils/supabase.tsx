import { createClient } from '@supabase/supabase-js'


let supabaseUrl = '';
let supabaseAnonKey = '';

const supabaseUrl_teste  = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey_teste = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if(supabaseUrl_teste !== undefined) {
  supabaseUrl = supabaseUrl_teste  
}

if(supabaseAnonKey_teste !== undefined) {  
  supabaseAnonKey = supabaseAnonKey_teste
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)



export async function getCurrentUser() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  if (!session?.user) {
    throw new Error('User not logged in')
  }

  return session.user
}