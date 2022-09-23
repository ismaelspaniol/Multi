import { useState, useEffect } from "react"
import { supabase, getCurrentUser } from '../../utils/supabase'
import Link from 'next/link'

import styles from '../../styles/Trade.module.css'
import { Itrade } from "../../abstracts/interfaces/trade"
import LoadingSpinner from "../../components/LoadingSpinner"

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

import { GridApi } from '@mui/x-data-grid-pro';
import { GridCellParams } from '@mui/x-data-grid-pro';

import Box from '@mui/material/Box';

// import { GridApi } from '@mui/x-data-grid-premium';
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
                        in_order : true };
  


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

           await data!.forEach(function(o) {
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
   
      
      if (confirm("Deseja realmente remover!")==true)
        {
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
  }

  const handleOnChangeInOrder = (e :any) => {     
    setFilter({
      ...filter!,
      [e.target.id]: !filter?.in_order,
    });
  };


  const columns: GridColDef[] = [    
    { field: 'amount', headerName: 'Quantidade', width: 90, type: 'text' },
    { field: 'unitary_value_buy', headerName: 'Vlr Compra', width: 90, type: 'number' },
    { field: 'unitary_value_sell', headerName: 'Vlr Venda', width: 85, type: 'number' },
    { field: 'gain', headerName: 'Ganho', width: 90, type: 'text' },
    { field: 'percent_gain', headerName: '% Ganho', width: 70, type: 'number' },
    { field: 'date_buy', headerName: 'Compra', width: 100, type: 'date' },
    { field: 'date_sell', headerName: 'Venda', width: 100, type: 'date' },
    { field: 'par_descricao', headerName: 'Moeda', width: 100, type: 'text' },
    {
      field: "actionUpdate",
      width: 60,
      headerName: "",
      sortable: false,
      renderCell: (params)  => {              
        return <Link href={`/trade/${params.getValue(params.id, 'id')}`}>
        <a>Update</a>
      </Link> 
      }
    },      
  
    {
      field: "actionRemover",
      headerName: "",
      width: 65,
      sortable: false,
      renderCell: (params : GridCellParams)  => {      
        return  <a href="#" onClick={() => _handleRemoveTrade(params.getValue(params.id, 'id'))}>
        {loading ? 'Gravando ...' : 'Remover'}
      </a> 
      }
    },      
  ];
  
  return (        
    <>
    {loading ? (<LoadingSpinner />) : (
      <div style={{ padding: '20px'}}>
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
      
      <Box sx={{ height: '700px', width: '100%' }}>
        <DataGrid style={{color: '#f2f2f2'}}
          rows={trades}
          columns={columns}          
          pageSize={50}
          rowsPerPageOptions={[500]}          
        />
      </Box>
    </div>
    
    )}                  
    </>
  )
}
