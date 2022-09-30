import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../../../../../utils/supabase'
import styles from '../../../../../../styles/Exercises.module.css'
import LoadingSpinner from "../../../../../../components/LoadingSpinner"
import { useRouter } from "next/router";

import Paper from '@mui/material/Paper';



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


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

<TableContainer component={Paper}>
      <Table sx={{ minWidth: 100 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Exercício</TableCell>
            <TableCell align="right">Repetições</TableCell>
            <TableCell align="right">Update</TableCell>
            <TableCell align="right">Delete</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {exercises.map((exercise : any) => (
            <TableRow
              key={exercise.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row"> 
                {exercise.exercise}
              </TableCell>
              <TableCell align="right">{exercise.repeat}</TableCell>              
              <TableCell align="right">
                <button onClick={() => {
                  router.push({
                    pathname: '/files/workouts/[id_file]/[id_workouts]/exercises/[exercise_id]',
                    query: { id_file: file_id,
                            id_workouts : workouts_id,
                            exercise_id : exercise.id 
                          },
                  })
                  }}>
                  Update
                </button>
                </TableCell>
              <TableCell  align="right">
                  <button onClick={() => _handleRemoveExercise(exercise.id)}>                    
                  {loading ? 'Gravando ...' : 'Remover'}                    
                    </button>
                  </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </div>
    </>            
  )
}
