import '../styles/globals.css'
import MainContainer from '../components/MainContainer'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import Auth from '../components/Auth'
import {Session} from '@supabase/gotrue-js/src/lib/types'


function MyApp({ Component, pageProps } : any) {  
  const [session, setSession] = useState<Session | null>(null)
  
  useEffect(() => {
    let mounted = true  
    async function getInitialSession() {
      const { data: { session }, } = await supabase.auth.getSession()
      if (mounted) {
        if (session) {
          
          setSession(session)
        }    
      }
      
    }

    getInitialSession()
    
    
    const { subscription }:any = supabase.auth.onAuthStateChange(
      (_event, session) => {
        
        setSession(session)
      }
    )

    return () => {
      mounted = false
      
      subscription?.unsubscribe()
    }
  }, [])

  return (
    <>
      {!session ? (
        <Auth />        
      ) : (

        <MainContainer>
          <Component {...pageProps} />
        </MainContainer>
      )}  
      
    </>
  
  )
}

export default MyApp
