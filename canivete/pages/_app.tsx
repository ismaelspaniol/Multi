import '../styles/globals.css'
import '../styles/spinner.css'
import MainContainer from '../components/MainContainer'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import Auth from '../components/Auth'
import {Session} from '@supabase/gotrue-js/src/lib/types'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoadingSpinner from '../components/LoadingSpinner'



const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function MyApp({ Component, pageProps } : any) {  
  const [session, setSession] = useState<Session | null | string>('x')
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    setLoading(true)             
    async function getInitialSession() {
      const { data: { session }, } = await supabase.auth.getSession()    
      if (session) {                    
        setSession(session)          
      }    
  
      
    }
    getInitialSession()       

    const { subscription }:any = supabase.auth.onAuthStateChange( (_event, session) => {     
        setSession(session)
        if (_event == 'SIGNED_OUT'){
          subscription?.unsubscribe()     
        }                
      }
    )
    setLoading(false)
            
  }, [])

  return (
    <>
      {loading ? (<LoadingSpinner />) : (
        !session ? (
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Auth />        
          </ThemeProvider>
        ) : (
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <MainContainer>
              <Component {...pageProps} />
            </MainContainer>
          </ThemeProvider>
        ) 
      )}
      
      
    </>
  
  )
}

export default MyApp
