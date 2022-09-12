import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabaseClient'
import Link from 'next/link'

import styles from '../../styles/Todos.module.css'

export default  function Pares (){
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(false)
  const [pares, setPares] = useState([])


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
        } catch (error) {
          alert(error.message)
        } 
      }

      handlePares();

  },[]) 




  
  return (        
    <>
        
        <h1>Lista de Pares de Cripto:</h1>
        <Link href={`/pares/add`}>
            <button>Criar Novo Par</button>
        
        </Link>
      <ul className={styles.todolist}>
        {pares.map((par) => (
          <li key={par.id}>
            {par.descricao}   
            <Link href={`/pares/${par.id}`}>
              <a>Update</a>
            </Link>         
          </li>
          
        ))}
      </ul>
    </>            
  )
}
