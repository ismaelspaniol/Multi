import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";

function PasswordReset() {
  const [password, setPassword] = useState(''); 
  const router = useRouter();
  
  const handleSubmit = async (e : any) => {
    e.preventDefault();

    // setLoading(true) 
    try {
      
        const { error, data } = await supabase.auth.updateUser({password: password});
        if (error) {                  
          alert(error.message);
        } else if (!error) {            
            alert("Senha alterada"); 
            router.push("/");           
        }
      
    } catch (error) {            
      console.log(error)
      alert("Ocorreu um erro");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="password"
          required
          value={password}
          placeholder="Por favor informe sua senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PasswordReset;