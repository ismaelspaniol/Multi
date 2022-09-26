import { getCurrentUser, supabase } from "../utils/supabase"

export async function getProfile() {
    try {
      
   
      const user = await getCurrentUser()            
      const { data, error } = await supabase.from('profiles').select('*')
       .eq('id', user.id)      
      if (error) {
        throw error
      }
      return data[0]
    } catch (error : any) {
      alert(error.message)
    }
   
  }