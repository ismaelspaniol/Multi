import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import Link from 'next/link'

import styles from '../../styles/Todos.module.css'

export default  function Pares (){
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const [pares, setPares] = useState<any>([])
  const [filter, setFilter]= useState<any>({refresh : Boolean})


  useEffect(() => {
    async function handlePares() {
        try {
          setLoading(true)
          const user = await getCurrentUser()
          console.log(user.id)
          
          let { data, error } = await supabase.from('par').select('*')
           .eq('user_id', user.id).order('date_add',{ascending: false})
            
        
            setPares(data) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }

      handlePares();
      setLoading(false)

  },[filter]) 


  async function _handleRemovePar(par_id : any) {
    try {
      setLoading(true)
      const user = await getCurrentUser()      
      
      let { data, error } = await supabase.from('par').delete().eq('id', par_id).eq('user_id', user.id) 
      console.log(data)  
      if (error) {
        
        throw error
      }
    } catch (error : any) {
      alert(error.message)
    } finally {
      setLoading(false)  
      setFilter({refresh : true})
          
    }
  }



  
  return (        
    <>
        
        <h1>Lista de Pares de Cripto:</h1>
        <Link href={`/pares/add`}>
            <button>Criar Novo Par</button>
        
        </Link>
      <ul className={styles.todolist}>
        {pares.map((par : any) => (
          <li key={par.id}>
            {par.descricao}   
            <Link href={`/pares/${par.id}`}>
              <a>Update</a>
            </Link>      

            <button
              className="button primary block"
              onClick={() => _handleRemovePar(par.id)}
              disabled={loading}
              >
              {loading ? 'Gravando ...' : 'Remover'}
            </button>     
          </li>
          
        ))}
      </ul>
    </>            
  )
}
