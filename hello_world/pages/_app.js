import '../styles/globals.css'
import MainContainer from '../components/MainContainer'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Auth from '../components/Auth'

function MyApp({ Component, pageProps }) {  
  const [session, setSession] = useState(null)
  
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
    
    
    const { subscription } = supabase.auth.onAuthStateChange(
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

        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (

        <MainContainer>
          <Component {...pageProps} />
        </MainContainer>
      )}  
      
    </>
  
  )
}

export default MyApp
