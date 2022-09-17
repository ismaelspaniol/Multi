import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import { useRouter } from "next/router";
import { Itrade } from "../../abstracts/interfaces/trade"
import moment from 'moment';
import styles from '../../styles/Trade.module.css'


export default  function Edit (){  
  const router = useRouter();
  const { id } = router.query;  
  let trade_inicial : Itrade = {
                        amount : 0,
                        user_id :'0',
                        date_buy : '',
                        date_sell : undefined,
                        in_order : true,
                        par_id : 0,
                        tax_buy : 0,
                        tax_sell : 0,
                        unitary_value_buy : 0,
                        unitary_value_sell : 0}

  const [loading, setLoading] = useState(false)
  const [pares, setPares] = useState<any>([])
  const [trade, setTrade] = useState<Itrade>(trade_inicial)


  useEffect(() => {
    async function handlePares() {
        try {          
          const user = await getCurrentUser()
                    
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

      const getTrade = async () => {
        if (id=='0'){
          const now = new Date();
          const user = await getCurrentUser()
          setTrade({
            ...trade!,
            user_id : user.id,
            date_buy : moment(now).format('YYYY-MM-DD'),                                        
          });
        }else{
          const { data } = await supabase
          .from("trade")
          .select("*")
          .filter("id", "eq", id)
          .single();
          setTrade(data);
          console.log(data)
        }                  
      };

      getTrade();
      handlePares();      
  },[id]) 
  

  async function _handleAddOrInsertTrade() {
    let in_error : boolean = false;
    try {
                  
      setLoading(true)  
      console.log(trade)     
      
      if(id=='0'){
        let { error } = await supabase.from('trade').insert(trade);     
        if (error) {
          throw error
        }
      } else{
        let { error } = await supabase.from('trade').update(trade).eq("id", id)
        .eq("user_id", trade!.user_id);   
        if (error) {
          throw error
        }
      }          
    } catch (error : any) {
      alert(error.message)
      in_error = true;
    } finally {
      setLoading(false)
      if(in_error === false){
        router.push("/trade");        
      }                      
    }
  }

  const handleOnChange = (e :any) => {     
    setTrade({
      ...trade!,
      [e.target.id]: e.target.value,
    });
  };

  const handleOnChangeInOrder = (e :any) => {     
    setTrade({
      ...trade!,
      [e.target.id]: !trade?.in_order,
    });
  };

  return (        
    <>
        <div className={styles.box}>
          <div  className={styles.group}>      
              <label htmlFor="website">Par</label>    
              <select className={styles.fields} id='par_id' value={trade?.par_id} onChange={handleOnChange}>
              <option key={0}  value={0}>{'----'}</option>
              {pares.map((par : any) => ( 
                  <option key={par.id}  value={par.id}>{par.descricao}</option>

              ))}                
              </select>                
          </div>

          <div className={styles.group}>        
              <label htmlFor="website">Quantidade</label>
              <input 
              className={styles.fields}
              id="amount"
              type="number"
              step="any"
              value={trade?.amount}        
              onChange={handleOnChange}        
              />    
          </div>

          <div className={styles.group}>
              <label htmlFor="website">Data Compra</label>
              <input
              className={styles.fields}
              id="date_buy"
              type="date"
              value={trade?.date_buy}        
              onChange={handleOnChange}        
              />    
          </div>

          <div className={styles.group}> 
              <label htmlFor="website">Data venda</label>
              <input
              className={styles.fields}
              id="date_sell"
              type="date"
              value={trade?.date_sell}        
              onChange={handleOnChange}        
              />    
          </div>

            

          <div className={styles.group}>
              <label htmlFor="website">Taxa Compra</label>
              <input
              className={styles.fields}
              id="tax_buy"
              type="number"
              step="any"
              value={trade?.tax_buy}        
              onChange={handleOnChange}        
              />    
          </div >


          <div className={styles.group}>
              <label htmlFor="website">Taxa venda</label>
              <input
              className={styles.fields}
              id="tax_sell"
              type="number"
              step="any"
              value={trade?.tax_sell}        
              onChange={handleOnChange}        
              />    
          </div >


          <div className={styles.group}>
              <label htmlFor="website">Valor unitario do ativo Compra</label>
              <input
              className={styles.fields}
              id="unitary_value_buy"
              type="number"
              step="any"
              value={trade?.unitary_value_buy}        
              onChange={handleOnChange}        
              />    
          </div>


          <div className={styles.group}>
              <label htmlFor="website">Valor Unitario do ativo na venda</label>
              <input
              className={styles.fields}
              id="unitary_value_sell"
              type="number"
              step="any"
              value={trade?.unitary_value_sell}        
              onChange={handleOnChange}        
              />    
          </div>  

          <div className={styles.check}>
              <label htmlFor="website">Em ordem</label>
              <input
             
              id="in_order"
              type="checkbox"            
              checked={trade?.in_order}
              onChange={handleOnChangeInOrder}        
              />    
          </div>  

          <div >
              <button   
              className={styles.save}           
              onClick={() => _handleAddOrInsertTrade()}
              disabled={loading}
              >
              {loading ? 'Gravando ...' : 'Salvar'}
              </button>
          </div>
        </div>
    </>            
  )
}
