import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../../../../../utils/supabase'

import styles from '../../../../../../styles/Files.module.css'
import LoadingSpinner from "../../../../../../components/LoadingSpinner"
import { useRouter } from "next/router";



export default  function Exercises (){

  const [loading, setLoading] = useState(true)
  const [exercises, setExercises] = useState<any>([])
  const [filter, setFilter]= useState<any>({refresh : Boolean})

  const router = useRouter();
  const { file_id, workouts_id } = router.query; 

  useEffect(() => {
    
    async function handleExercise() {
        try {
          setLoading(true)       
          const user = await getCurrentUser()               
          let { data, error } = await supabase.from('exercises').select('*')
           .eq('user_id', user.id)
           .eq('workout_id',workouts_id )
           .order('id',{ascending: false})                
           console.log(data)
            setExercises(data) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }
      if (workouts_id){ 
        handleExercise();
      }
      setLoading(false)

  },[workouts_id, filter]) 


  async function _handleRemoveExercise(exercise_id : any) {
    if (confirm("Deseja realmente remover!")==true){
        try {
        setLoading(true)
        const user = await getCurrentUser()    
             
        let { data, error } = await supabase.from('exercises').delete().eq('id', exercise_id).eq('user_id', user.id)       
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
    			<h1>Lista de Exercicios</h1>
            	
          <button  onClick={() => {
                                    router.push({
                                    pathname: '/files/workouts/[id_file]/[id_workouts]/exercises/[exercise_id]',
                                    query: { id_file: file_id,
                                            id_workouts : workouts_id,
                                            exercise_id : 0 
                                          },
                                      })
                                  }
                              }>
            Inserir Exercício
          </button>
           
            	<ul className={styles.list}>
					{exercises.map((exercise : any) => (
					<li key={exercise.id}>
						
                                            
						<a href="#" onClick={() => {
                  router.push({
                    pathname: '/files/workouts/[id_file]/[id_workouts]/exercises/[exercise_id]',
                    query: { id_file: file_id,
                            id_workouts : workouts_id,
                            exercise_id : exercise.id 
                          },
                  })
                  }}>Update
                </a>		    

						<a href="#"
						onClick={() => _handleRemoveExercise(exercise.id)}>
							{loading ? 'Gravando ...' : 'Remover'}
						</a> 

       
            <a>{exercise.exercise}  </a>

					</li>                    
                    
					))}

                    
                </ul>   
            </div>
      )}   
       
    </>            
  )
}
