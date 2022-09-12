import { useState } from 'react'
import { supabase } from '../utils/supabase'


export default function SingUp() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (email : string, password : string) => {
    try {
      setLoading(true)
      
      const { error  }  = await supabase.auth.signUp({ email: email, password: password })
      if (error) throw error
      alert('Check your email!')
    } catch (error : any) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex-center flex">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + Next.js</h1>
        <p className="description">
            Creates a new user.
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
            <span>{loading ? 'Loading' : 'Create User'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}