import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { supabase, getCurrentUser } from "../../utils/supabase";



const Edit = () => {
    const [par, setPar] = useState<any>({descricao:''} );
    const router = useRouter();
  
    const { id } = router.query;
    useEffect(() => {
      const getPar = async () => {
        if (!id) return;
  
        const { data } = await supabase
          .from("par")
          .select("descricao")
          .filter("id", "eq", id)
          .single();
        setPar(data);
      };
      getPar();
    }, [id]);
  
    const handleOnChange = (e :any) => {
      setPar({
        ...par,
        [e.target.name]: e.target.value,
      });
    };
  
    const updatePar = async () => {
      const { descricao } = par;
      const user = await getCurrentUser();
      console.log(descricao)
      console.log(user.id)
      const { data } = await supabase
        .from("par")
        .update({
          descricao,          
        })
        .eq("id", id)
        .eq("user_id", user.id);
  
      alert("Par updated successfully");
  
      router.push("/pares");
    };
    return (
      <div >
        <div >
          <h1 >Edit Par</h1>
          <label > descricao</label>
          <input
            type="text"
            name="descricao"
            value={par?.descricao}
            onChange={handleOnChange}
            
          />
                              
  
          <button onClick={updatePar}>
            Update Workout
          </button>
        </div>
      </div>
    );
  };
  
  export default Edit;