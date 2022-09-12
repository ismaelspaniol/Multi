import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import Select from 'react-select'
import moment from 'moment';
import { useRouter } from "next/router";


export default  function AddTrade (){
  const now = new Date();
  const router = useRouter();
 
  const [amount, setAmount] = useState<number>(0)  
  const [date_buy,setDate_buy] = useState<string>(moment(now).format('YYYY-MM-DD'))  
  const [date_sell, setDate_sell] = useState<string>()  
  const [in_order,setIn_order] = useState<number>(0)  
  const [par_id, setPar_id] = useState<string>('1')  
  const [tax_buy, setTax_buy] = useState<number>(0)  
  const [tax_sell,setTax_sell] = useState<number>(0)  
  const [unitary_value_buy,setUnitary_value_buy] = useState<number>(0)  
  const [unitary_value_sell,setUnitary_value_sell] = useState<number>(0)  

  const [loading, setLoading] = useState(false)
  const [pares, setPares] = useState<any>([])

  

  useEffect(() => {
    async function handlePares() {
        try {          
          const user = await getCurrentUser()
          console.log(user.id)
          
          let { data, error } = await supabase.from('par').select('*')
           .eq('user_id', user.id).order('date_add',{ascending: false})
            
            
            setPares(data) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }

      handlePares();
      console.log({pares})

  },[]) 
  

  async function _handleAddTrade() {
    try {
                  
      setLoading(true)
      const user = await getCurrentUser()
      const insert = {
        amount : amount,
        date_buy : date_buy,
        date_sell : date_sell,
        in_order : in_order,
        par_id : par_id,
        tax_buy : tax_buy,
        tax_sell : tax_sell,
        unitary_value_buy : unitary_value_buy,
        unitary_value_sell : unitary_value_sell,
        user_id : user.id
        
      }
      console.log(insert)
      let { error } = await supabase.from('trade').insert(insert)   
      if (error) {
        throw error
      }
    } catch (error : any) {
      alert(error.message)
    } finally {
      setLoading(false)
      router.push("/trade");
      
    }
  }

  function handleChange(event : any) {    
    setPar_id(event.target.value);    
  }

  
  return (        
    <>
        
        <div>          
            <select value={par_id} onChange={handleChange}>
            {pares.map((par : any) => ( 
                <option key={par.id} value={par.id}>{par.descricao}</option>

            ))}
                
            </select>
                
        </div>

        <div>        
            <label htmlFor="website">Quantidade</label>
            <input
            id="amount"
            type="number"
            value={amount}        
            onChange={(e) => setAmount(Number(e.target.value))}        
            />    
        </div>

        <div>
            <label htmlFor="website">Data Compra</label>
            <input
            id="date_buy"
            type="date"
            value={date_buy}        
            onChange={(e) => setDate_buy(e.target.value)}        
            />    
        </div>

        <div>
            <label htmlFor="website">Data venda</label>
            <input
            id="date_sell"
            type="date"
            value={date_sell}        
            onChange={(e) => setDate_sell(e.target.value)}        
            />    
        </div>

        <div>
            <label htmlFor="website">Em ordem</label>
            <input
            id="in_order"
            type="number"
            value={in_order}        
            onChange={(e) => setIn_order(Number(e.target.value))}        
            />    
        </div>    

        <div>
            <label htmlFor="website">Taxa Compra</label>
            <input
            id="tax_buy"
            type="number"
            value={tax_buy}        
            onChange={(e) => setTax_buy(Number(e.target.value))}        
            />    
        </div>


        <div>
            <label htmlFor="website">Taxa venda</label>
            <input
            id="tax_sell"
            type="number"
            value={tax_sell}        
            onChange={(e) => setTax_sell(Number(e.target.value))}        
            />    
        </div>


        <div>
            <label htmlFor="website">Valor unitario do ativo Compra</label>
            <input
            id="unitary_value_buy"
            type="number"
            value={unitary_value_buy}        
            onChange={(e) => setUnitary_value_buy(Number(e.target.value))}        
            />    
        </div>


        <div>
            <label htmlFor="website">Valor Unitario do ativo na venda</label>
            <input
            id="unitary_value_sell"
            type="number"
            value={unitary_value_sell}        
            onChange={(e) => setUnitary_value_sell(Number(e.target.value))}        
            />    
        </div>

        <div>
            <button
            className="button primary block"
            onClick={() => _handleAddTrade()}
            disabled={loading}
            >
            {loading ? 'Gravando ...' : 'Salvar'}
            </button>
        </div>
    </>            
  )
}
