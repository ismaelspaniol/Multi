import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabaseClient'

export default  function AddPar (){
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)


  async function _handleAddPar() {
    try {
      setLoading(true)
      const user = await getCurrentUser()
      const insert = {
        descricao: descricao,
        user_id : user.id
        
      }

      let { error } = await supabase.from('par').insert(insert)   
      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
      setDescricao('')
    }
  }

  
  return (        
    <>
        
        <div>
            <label htmlFor="website">Par de Cripto</label>
        <input
        id="descricao"
        type="text"
        value={descricao}
        
        onChange={(e) => setDescricao(e.target.value)}
        onKeyDown={e => {
                if (e.key === "Enter") {
                _handleAddPar()
                }}}
        />    
        </div>

        <div>
        <button
        className="button primary block"
        onClick={() => _handleAddPar()}
        disabled={loading}
        >
        {loading ? 'Gravando ...' : 'Salvar'}
        </button>
        </div>
    </>            
  )
}
