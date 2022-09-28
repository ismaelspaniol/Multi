
import styles from '../../styles/Profile.module.css'
import { supabase, getCurrentUser } from '../../utils/supabase'
import { useState, useEffect } from 'react'
import { getProfile } from '../../supabase/profiles'

import {User} from '@supabase/gotrue-js/src/lib/types'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function Profile(){
    const [user, setUser] = useState<User | null>();
    const [profile, setProfile] = useState<any>();
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(true)

    useEffect(() => {
    
        async function handle() {
            try {
              setLoadingPage(true)
           
              const vuser = await getCurrentUser()                            
              setUser(vuser)    
              const vprofile = await getProfile()                           
              setProfile(vprofile)    
              if ( typeof vprofile == 'undefined' ) {
                setProfile({
                  ...profile,
                  ['id'] : vuser?.id
                }
                );
              }
             
            } catch (error : any) {
              alert(error.message)
            }
          }
          handle()         
          setLoadingPage(false)    
      },[]) 


      const handleOnChange = (e :any) => {     
        setProfile({
          ...profile!,
          [e.target.id]: e.target.value,
        });
      };


      async function _handleAddOrUpdateProfile() {        
        try {
                      
          setLoading(true)                                        
          if (profile.name){            
            const { data, error } = await supabase
            .from('profiles')
            .upsert(profile)  
            if (error) {
              throw error    
          }                      
          }          
        } catch (error : any) {
            alert(error.message)          
        } finally {
            setLoading(false)          
        }
      }
    return (
       <>
        {loadingPage ? (<LoadingSpinner />) : (
            <div className={styles.box}>
              <div className={styles.group}>
                  <label htmlFor="website">Nome Completo</label>
                  <input
                  className={styles.fields}
                  id="name"
                  type="text"
                  step="any"
                  value={profile?.name}        
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