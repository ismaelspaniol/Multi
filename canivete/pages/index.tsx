import Head from 'next/head'
import Image from 'next/image'
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <>    
      <Head>
        <title>Pagina Principal</title>
        <meta name='keyworkds' content='Contrle de trades, bitcoin, etherium'></meta>        
      </Head>

      <Typography component={'span'} >
        <h1> Bem vindo ao controle de trade</h1>
        <Image src="/city.jpg" width="400px" height="300px" alt="Cidade a noite" />  
         <p>Bem vindo ao controle de trade assda asd a asda asda  asdasd asda  asad as as asdasd Bem vindo ao controle de trade assda asd a asda asda  asdasd asda  asad as as asdasd Bem vindo ao controle de trade assda asd a asda asda  asdasd asda  asad as as asdasd</p>   
       
      </Typography>               
    </>

  )
}



