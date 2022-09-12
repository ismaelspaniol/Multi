import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function PasswordReset() {
  const [password, setPassword] = useState(''); 
  
  const handleSubmit = async (e : any) => {
    e.preventDefault();

    // setLoading(true) 
    try {
      
        const { error, data } = await supabase.auth.updateUser({password: password});
        if (error) {                  
          alert(error.message);
        } else if (!error) {            
            alert("Password Changed");          
        }
      
    } catch (error) {            
      console.log(error)
      alert("Sorry Error occured");
    }
  };

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type="password"
          required
          value={password}
          placeholder="Please enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PasswordReset;