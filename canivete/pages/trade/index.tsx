import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import Link from 'next/link'

import styles from '../../styles/Trade.module.css'
import { Itrade } from "../../abstracts/interfaces/trade"
import LoadingSpinner from "../../components/LoadingSpinner"


interface IFilter {
  refresh : boolean,
  par_id : number,
  in_order : boolean | undefined
}

interface LooseObject {
  [key: string]: any
}

interface TradesObject extends Itrade {}
class TradesObject {
   
  readonly  total_value_buy : number;
  readonly  total_value_sell : number;
  readonly  gain : number;
  readonly  percent_gain : number;
    par_descricao : string;

    constructor(props : any) {
       
        this.id = props.id,
        this.amount = props.amount, 
        this.date_buy = props.date_buy,  
        this.date_sell = props.date_sell,  
        this.in_order = props.in_order,
        this.par_descricao = props.par.descricao,                   
        this.tax_buy = props.tax_buy,
        this.tax_sell= props. tax_sell,
        this.unitary_value_buy = props.unitary_value_buy,
        this.unitary_value_sell = props.unitary_value_sell,
        this.user_id = props.user_id,

        this.total_value_buy = this.unitary_value_buy * this.amount,
        this.total_value_sell = this.unitary_value_sell * this.amount,
        this.gain = this.total_value_sell - this.total_value_buy - this.tax_sell,
        this.percent_gain = (((this.total_value_sell - this.tax_sell) * 100) / (this.total_value_buy + this.tax_buy))-100


    }
  }

export default  function Trade (){
  let fil : IFilter = {
                        refresh : true,
                        par_id : 0,
                        in_order : false };
  


  const [loading, setLoading] = useState(true)
  const [trades, setTrades] = useState<TradesObject[]>([])
  const [filter, setFilter]= useState<IFilter>(fil)
  const [pares, setPares] = useState<any>([])

  useEffect(() => {
    console.log('usereffect')
    setLoading(true)

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


    async function handleTrades() {        
        try {
          
          const user = await getCurrentUser()

          let filtro :LooseObject  = {}
          
          if (filter.par_id != 0){
            filtro.par_id = filter.par_id            
          }

          // console.log(filter.in_order)
          if (filter.in_order !== undefined){
            filtro.in_order = filter.in_order       
          }
          // filtro.date_sell = null             
          
          //par( descricao ),  
          let { data  , error } = await supabase.from('trade')
           .select(`id,
                    amount, 
                    date_buy, 
                   date_sell, 
                   in_order,
                   par!inner(descricao),                                     
                   tax_buy,
                   tax_sell,
                   unitary_value_buy,
                   unitary_value_sell,
                   user_id`)
           .eq('user_id', user.id)             
           .match(filtro)                                 
           .order('id',{ascending: false})
           
           let trades : Array<any> = []

           data!.forEach(function(o) {
            let t = new TradesObject(o)
            trades.push(t)
            }) 
            console.log(trades)
            
            setTrades(trades) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }

      handleTrades();
      handlePares();
      setLoading(false)

  },[filter]) 

  const handleOnChange = (e :any) => {     
    setFilter({
      ...filter!,
      [e.target.id]: e.target.value,
    });
    console.log(filter)
  };


  async function _handleRemoveTrade(par_id : any) {
    try {
      setLoading(true)
      const user = await getCurrentUser()      
      
      let { data, error } = await supabase.from('trade').delete().eq('id', par_id).eq('user_id', user.id) 
      console.log(data)  
      if (error) {
        
        throw error
      }
    } catch (error : any) {
      alert(error.message)
    } finally {
      setLoading(false)        

      setFilter({
        ...filter!,
        refresh: true,
      });

          
    }
  }

  const handleOnChangeInOrder = (e :any) => {     
    setFilter({
      ...filter!,
      [e.target.id]: !filter?.in_order,
    });
  };
  
  return (        
    <>
     {loading ? (<LoadingSpinner />) : (
          <div className={styles.container}>
            <div className={styles.novo}>
              <Link href={`/trade/0`}>
                <button className={styles.bottonnovo}>Criar Novo Trade</button>                      
              </Link>
              <select id='par_id' value={filter?.par_id} onChange={handleOnChange}>
              <option key={0}  value={0}>{'----'}</option>
              {pares.map((par : any) => ( 
                  <option key={par.id}  value={par.id}>{par.descricao}</option>

              ))}                
              </select> 
            </div>

            <div className={styles.check}>
              <label htmlFor="website">Em ordem</label>
              <input
             
              id="in_order"
              type="checkbox"            
              checked={filter?.in_order}
              onChange={handleOnChangeInOrder}        
              />    
          </div>       

            <div>
                <table className={styles.table}>  
                  <thead>
                    <tr  className={styles.tr}>
                      <th className={styles.th}>Quantidade</th>
                      <th className={styles.th}>Valor Compra</th>                                            
                      <th className={styles.th}>Valor Venda</th>                                            
                      <th className={styles.th}>Ganho</th>
                      <th className={styles.th}>Percentual de Ganho</th>                      
                      <th className={styles.th}>Data Compra</th>
                      <th className={styles.th}>Data Venda</th>
                      
                      <th className={styles.th}>Par</th>                                                                                        
                      <th className={styles.th}>Update</th>
                    </tr>
                  </thead>  
                  
                  <tbody>

                    {trades.map((trade) => (            
                        <tr key={trade.id} className={styles.tr}>
                          <td className={styles.td}>{trade.amount}</td>
                          <td className={styles.td}>{trade.unitary_value_buy}</td>
                                                    
                          <td className={styles.td}>{trade.unitary_value_sell}</td>
                          
                          
                          <td className={styles.td}>{trade.gain}</td>
                          <td className={styles.td}>{trade.percent_gain}</td>
                          <td className={styles.td}>{trade.date_buy}</td>
                          <td className={styles.td}>{trade.date_sell}</td>                          
                          <td className={styles.td}>{trade.par_descricao}</td>
                                                                                                                                  
                          <td className={styles.td}>
                            <Link href={`/trade/${trade.id}`}>
                              <a>Update</a>
                            </Link> 
                            <a onClick={() => _handleRemoveTrade(trade.id)}>
                              {loading ? 'Gravando ...' : 'Remover'}
                            </a> 
                          </td>
                        </tr>            
                    ))}
                  </tbody>
                </table>  
              </div>
          </div>
        )}            
    </>
  )
}
