import { useState, useEffect } from 'react'
import { getBaseUrl, supabase } from '../utils/supabase'
// import Link from 'next/link'
import  Singup  from '../components/Singup'


import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Copyright } from '../utils/utils';

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [createUser, setCreateUser] = useState(false)
  


  const forgotPassword = async (email : string) => {
    if (email) {
      try {
        setLoading(true)     
        const url : string = getBaseUrl()+'/password-reset';
        console.log(url)            
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: url}) //
        if (error) throw error
        alert('Verifique seu email') 
      } catch (error : any) {
        alert(error.error_description || error.message)      
      }finally {
        setLoading(false)
      }
    }
    
  }

  const handleLogin = async (email : string, password : string)  => {
    try {     
      setLoading(true)            
      const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })
      console.log(data)
      if (error) throw error
      
    } catch (error : any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {createUser? (
      <Singup />
    ):(
      
        <Grid container component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: 'url(https://source.unsplash.com/random)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  autoComplete="current-password"
                />              
                <Button                  
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLogin(email, password)
                    
                  }}
                  disabled={loading}
                >
                  <span>{loading ? 'Carregando' : 'Login'}</span>
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="#" variant="body2" onClick={() =>forgotPassword(email)}>
                      Esqueceu a Senha?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link href="#" variant="body2" onClick={() =>setCreateUser(true)}>
                      {"Criar Conta"}
                    </Link>
                  </Grid>
                </Grid>
                <Copyright sx={{ mt: 5 }} />

              </Box>
            </Box>
          </Grid>
        </Grid>
      
    )}
    </>  
  )
}