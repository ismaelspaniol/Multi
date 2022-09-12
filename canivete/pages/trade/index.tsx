import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import Link from 'next/link'

import styles from '../../styles/Trade.module.css'


class TradesObject {
    id : number;
    amount : number;
    date_buy : string;  
    date_sell : string;
    in_order : number;
    par_descricao : string;
    tax_buy : number;
    tax_sell : number;
    unitary_value_buy : number;
    unitary_value_sell : number;
    total_value_buy : number;
    total_value_sell : number;
    gain : number;
    percent_gain : number;

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

        this.total_value_buy = this.unitary_value_buy * this.amount,
        this.total_value_sell = this.unitary_value_sell * this.amount,
        this.gain = this.total_value_sell - this.total_value_buy - this.tax_sell,
        this.percent_gain = (((this.total_value_sell - this.tax_sell) * 100) / (this.total_value_buy + this.tax_buy))-100


    }
  }

export default  function Trade (){
    const [loading, setLoading] = useState(false)
  const [trades, setTrades] = useState<TradesObject[]>([])

  


  useEffect(() => {
    async function handleTrades() {
        try {
          setLoading(true)
          const user = await getCurrentUser()
          console.log(user.id)

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
                   unitary_value_sell`)
           .eq('user_id', user.id)                       
           .order('date_buy',{ascending: false})
           console.log(data)
           let trades : Array<any> = []

           data!.forEach(function(o) {
            let t = new TradesObject(o)
            trades.push(t)
            }) 
            
            setTrades(trades) 
          if (error) {
            throw error
          }
        } catch (error : any) {
          alert(error.message)
        } 
      }

      handleTrades();

  },[]) 
  
  return (        
   <table className={styles.table}>  
        <thead>
          <tr  className={styles.tr}>
              <th className={styles.th}>Quantidade</th>
              <th className={styles.th}>Valor Compra</th>
              <th className={styles.th}>Taxa Compra</th>
              <th className={styles.th}>Total Compra</th>

              <th className={styles.th}>Valor Venda</th>
              <th className={styles.th}>Taxa Venda</th>
              <th className={styles.th}>Total Venda</th>

              <th className={styles.th}>Ganho</th>
              <th className={styles.th}>Percentual de Ganho</th>

              
              <th className={styles.th}>Data Compra</th>
              <th className={styles.th}>Data Venda</th>
              <th className={styles.th}>Em Ordem</th>
              <th className={styles.th}>Par</th>
              
              
              
              
              <th className={styles.th}>Update</th>


          </tr>
        </thead>  
        <tbody>

          {trades.map((trade) => (            
              <tr key={trade.id} className={styles.tr}>
                  <td className={styles.td}>{trade.amount}</td>
                  <td className={styles.td}>{trade.unitary_value_buy}</td>
                  <td className={styles.td}>{trade.tax_buy}</td>
                  <td className={styles.td}>{trade.total_value_buy}</td>
                  
                  <td className={styles.td}>{trade.unitary_value_sell}</td>
                  <td className={styles.td}>{trade.tax_sell}</td>
                  <td className={styles.td}>{trade.total_value_sell}</td>

                  <td className={styles.td}>{trade.gain}</td>
                  <td className={styles.td}>{trade.percent_gain}</td>

                  <td className={styles.td}>{trade.date_buy}</td>
                  <td className={styles.td}>{trade.date_sell}</td>
                  <td className={styles.td}>{trade.in_order}</td>
                  <td className={styles.td}>{trade.par_descricao}</td>
                  
                  
                  
                  
                  <td className={styles.td}><Link href={`/trade/${trade.id}`}>
                <a>Update</a>
              </Link> </td>
              </tr>            
          ))}
        </tbody>
    </table>  

   

  )
}
