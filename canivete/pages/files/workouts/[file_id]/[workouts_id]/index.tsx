import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../../../../utils/supabase'
import { useRouter } from "next/router";
import styles from '../../../../../styles/Files.module.css'
import {User} from '@supabase/gotrue-js/src/lib/types'
import LoadingSpinner from "../../../../../components/LoadingSpinner";

export default  function Edit (){  
    const [loading, setLoading] = useState(false)
    const [workout, setWorkout] = useState<any>()
    const [user, setUser] = useState<User | null>();

    const router = useRouter();
    const { file_id, workouts_id } = router.query; 
   

    useEffect(() => {       
        const getWorkout = async () => {
        const user = await getCurrentUser()                            
        setUser(user)          
        console.log(workouts_id)  
        if (workouts_id){
            if (workouts_id=='0'){
                console.log('zero')                        
                setWorkout({
                ...workout!,
                user_id : user.id, 
                file_id : file_id               
                });
            }else{
                const { data, error } = await supabase
                .from("workouts")
                .select("*")
                .filter("id", "eq", workouts_id)
                .filter("user_id", 'eq', user.id)
                .single();
                setWorkout(data);                
            } 
        }          
        };

        getWorkout();         
    },[workouts_id]); 


    async function _handleAddOrUpdateWorkout() {        
        try {
                      
          setLoading(true)                                        
          if (workout.description){            
            const { data, error } = await supabase
            .from('workouts')
            .upsert(workout)  
            if (error) {
              throw error    
          }                      
          }   
          console.log(workout)       
        } catch (error : any) {
            alert(error.message)          
        } finally {
            setLoading(false) 
            router.push(`/files/workouts/`+file_id+`/list`)         
        }
      }


      const handleOnChange = (e :any) => {     
        setWorkout({
          ...workout!,
          [e.target.id]: e.target.value,
        });
      };



    return (
        <>
        {loading ? (<LoadingSpinner />) : (
            <div className={styles.box}>
              <div className={styles.group}>
                  <label htmlFor="website">Descrição</label>
                  <input
                  className={styles.fields}
                  id="description"
                  type="text"
                  step="any"
                  value={workout?.description}        
                  onChange={handleOnChange}        
                  />    
              </div >
              <div >
                <button   
                className={styles.save}           
                onClick={() => _handleAddOrUpdateWorkout()}
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