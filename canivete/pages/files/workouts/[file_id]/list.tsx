import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../../../utils/supabase'
import Link from 'next/link'
import styles from '../../../../styles/Workouts.module.css'
import LoadingSpinner from "../../../../components/LoadingSpinner"
import { useRouter } from "next/router";

export default  function Workouts (){

  const [loading, setLoading] = useState(true)
  const [workouts, setWorkouts] = useState<any>([])
  const [filter, setFilter]= useState<any>({refresh : Boolean})
  const router = useRouter();
  const { file_id } = router.query;   

  useEffect(() => {
    
    async function handleWorkouts() {
        try {
          setLoading(true)
       
          const user = await getCurrentUser()
          
          let { data, error } = await supabase.from('workouts').select('*')
           .eq('user_id', user.id)
           .eq('file_id', file_id)
           .order('id',{ascending: false})      
           
           
            setWorkouts(data) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }
      
      handleWorkouts();
      setLoading(false)

  },[filter]) 


  async function _handleRemoveWorkouts(workouts_id : any) {
    if (confirm("Deseja realmente remover!")==true){
        try {
        setLoading(true)
        const user = await getCurrentUser()            
        let { data, error } = await supabase.from('workouts').delete().eq('id', workouts_id).eq('user_id', user.id)       
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
    			  <h1>Lista de Treinos:</h1>            	
            <button onClick={() => {
              router.push({
                pathname: '/files/workouts/[id_file]/[id_workouts]',
                query: { id_file: file_id,
                        id_workouts : 0 
                      },
              })
              }}>
                Criar Novo Treino
            </button>
            
            <ul className={styles.list}>
					  {workouts.map((workout : any) => (
					    <li key={workout.id}>						                                            						
                <a href="#" onClick={() => {
                  router.push({
                    pathname: '/files/workouts/[id_file]/[id_workouts]',
                    query: { id_file: file_id,
                            id_workouts : workout.id 
                          },
                  })
                  }}>Update
                </a>						
                <a href="#"
                onClick={() => _handleRemoveWorkouts(workout.id)}>
                  {loading ? 'Gravando ...' : 'Remover'}
                </a> 

                
							    <a href="#" onClick={() => {
                  router.push({
                    pathname: '/files/workouts/[id_file]/[id_workouts]/exercises',
                    query: { id_file: file_id,
                            id_workouts : workout.id 
                          },
                  })
                  }}>{workout.description}  </a>
						    

					</li>                    
                    
					))}

                    
                </ul>   
            </div>
      )}   
       
    </>            
  )
}
