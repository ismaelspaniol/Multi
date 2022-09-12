import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'
import Link from 'next/link'
import  Singup  from '../components/Singup'
import toast from "react-hot-toast";

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [createUser, setCreateUser] = useState(false)
  const [hash, setHash] = useState(null);



  const forgotPassword = async (email) => {
    if (email) {
      try {
        setLoading(true) 
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: "http://localhost:3000/password-reset"})
        if (error) throw error
        alert('Check your mail!') 
      } catch (error) {
        alert(error.error_description || error.message)      
      }finally {
        setLoading(false)
      }
    }
    
  }

  const handleLogin = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email: email, password: password })
      console.log(data)
      if (error) throw error
      alert('Logged successfully!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {createUser? (
        <Singup />
      ):
      (
        <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <p className="description">
          Sign in via email and password
        </p>
        <div>
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="inputField"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email, password)
            }}
            className="button block"
            disabled={loading}
          >
            <span>{loading ? 'Loading' : 'Login'}</span>
          </button>
        </div>
      </div>
      <button onClick={() =>setCreateUser(true)}><a>Criar Usuario</a></button>      
      <button onClick={() =>forgotPassword(email)}><a>Alterar Senha</a></button> 
      {hash? (    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="password"
          required
          value={password}
          placeholder="Please enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>) : (<h1>Teste</h1>)}  
    </div>   
      )}
    
    
    </>
  )
}