import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import Link from 'next/link'
import styles from '../../styles/Files.module.css'
import LoadingSpinner from "../../components/LoadingSpinner"


export default  function Files (){

  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<any>([])
  const [filter, setFilter]= useState<any>({refresh : Boolean})


  useEffect(() => {
    
    async function handleFiles() {
        try {
          setLoading(true)
       
          const user = await getCurrentUser()
          
          let { data, error } = await supabase.from('files').select('*')
           .eq('user_id', user.id).order('id',{ascending: false})      
           
           
            setFiles(data) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }
      
      handleFiles();
      setLoading(false)

  },[filter]) 


  async function _handleRemoveFile(file_id : any) {
    if (confirm("Deseja realmente remover!")==true){
        try {
        setLoading(true)
        const user = await getCurrentUser()            
        let { data, error } = await supabase.from('files').delete().eq('id', file_id).eq('user_id', user.id)       
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
  }

  return (        
    <>
      {loading ? (<LoadingSpinner />) : (
          <div className={styles.main}>
    			<h1>Lista de Fichas de treino:</h1>
            	<Link href={`/files/0`}>
                	<button>Criar Novo Treino</button>
            	</Link>
            	<ul className={styles.list}>
					{files.map((file : any) => (
					<li key={file.id}>
						
                                            
						<Link href={`/files/${file.id}`}>
							<a>Update</a>
						</Link>      

						<a href="#"
						onClick={() => _handleRemoveFile(file.id)}>
							{loading ? 'Gravando ...' : 'Remover'}
						</a> 

            <Link href={`/files/workouts/`+file.id+`/list`}>
							<a>{file.description}  </a>
						</Link>      

					</li>                    
                    
					))}

                    
                </ul>   
            </div>
      )}   
       
    </>            
  )
}
