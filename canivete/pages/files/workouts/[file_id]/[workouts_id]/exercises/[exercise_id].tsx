import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../../../../../utils/supabase'
import { useRouter } from "next/router";
import styles from '../../../../../../styles/Files.module.css'
import {User} from '@supabase/gotrue-js/src/lib/types'
import LoadingSpinner from "../../../../../../components/LoadingSpinner";

export default  function Edit (){  
    const [loading, setLoading] = useState(false)
    const [exercise, setExercise] = useState<any>()
    const [user, setUser] = useState<User | null>();

    const router = useRouter();
    const { file_id, workouts_id, exercise_id } = router.query; 
   

    useEffect(() => {       
        const getExercise = async () => {
        const user = await getCurrentUser()                            
        setUser(user)          
        console.log(workouts_id)  
        if (workouts_id){
            if (exercise_id=='0'){
                console.log('zero')                        
                setExercise({
                ...exercise!,
                user_id : user.id, 
                workout_id : workouts_id              
                });
            }else{
                const { data, error } = await supabase
                .from("exercises")
                .select("*")
                .filter("id", "eq", exercise_id)
                .filter("user_id", 'eq', user.id)
                .single();
                setExercise(data);                
            } 
        }          
        };

        getExercise();         
    },[workouts_id]); 


    async function _handleAddOrUpdateExercise() {        
        try {
          console.log(exercise)            
          setLoading(true)                                        
          if (exercise.exercise){            
            const { data, error } = await supabase
            .from('exercises')
            .upsert(exercise)  
            if (error) {
              throw error    
          }                      
          }   
          console.log(exercise)       
        } catch (error : any) {
            alert(error.message)          
        } finally {
            setLoading(false) 
            router.push(`/files/workouts/`+file_id+`/`+workouts_id+`/exercises`)         
        }
      }


      const handleOnChange = (e :any) => {     
        setExercise({
          ...exercise!,
          [e.target.id]: e.target.value,
        });
      };



    return (
        <>
        {loading ? (<LoadingSpinner />) : (
            <div className={styles.box}>
              <div className={styles.group}>
                  <label htmlFor="website">Exercício</label>
                  <input
                  className={styles.fields}
                  id="exercise"
                  type="text"
                  step="any"
                  value={exercise?.exercise}        
                  onChange={handleOnChange}        
                  />    
              </div >
              <div className={styles.group}>
                  <label htmlFor="website">Repetições</label>
                  <input
                  className={styles.fields}
                  id="repeat"
                  type="text"
                  step="any"
                  value={exercise?.repeat}        
                  onChange={handleOnChange}        
                  />    
              </div >
              <div >
                <button   
                className={styles.save}           
                onClick={() => _handleAddOrUpdateExercise()}
                disabled={loading}
                >
                {loading ? 'Gravando ...' : 'Salvar'}
                </button>
              </div>
            </div>        
        )}      
       </>
    )

}