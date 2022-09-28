import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import { useRouter } from "next/router";
import styles from '../../styles/Files.module.css'
import {User} from '@supabase/gotrue-js/src/lib/types'
import LoadingSpinner from "../../components/LoadingSpinner";

export default  function Edit (){  
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState<any>()
    const [user, setUser] = useState<User | null>();

    const router = useRouter();
    const { id } = router.query; 
   

    useEffect(() => {       
        const getFile = async () => {
        const user = await getCurrentUser()                            
        setUser(user)          
        console.log(id)  
        if (id){
            if (id=='0'){
                console.log('zero')                        
                setFile({
                ...file!,
                user_id : user.id,                
                });
            }else{
                const { data, error } = await supabase
                .from("files")
                .select("*")
                .filter("id", "eq", id)
                .filter("user_id", 'eq', user.id)
                .single();
                setFile(data);
                console.log(error)
            } 

        }
                        
        };

        getFile();         
    },[id]); 


    async function _handleAddOrUpdateProfile() {        
        try {
                      
          setLoading(true)                                        
          if (file.description){            
            const { data, error } = await supabase
            .from('files')
            .upsert(file)  
            if (error) {
              throw error    
          }                      
          }          
        } catch (error : any) {
            alert(error.message)          
        } finally {
            setLoading(false) 
            router.push('/files')         
        }
      }


      const handleOnChange = (e :any) => {     
        setFile({
          ...file!,
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
                  value={file?.description}        
                  onChange={handleOnChange}        
                  />    
              </div >
              <div >
                <button   
                className={styles.save}           
                onClick={() => _handleAddOrUpdateProfile()}
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