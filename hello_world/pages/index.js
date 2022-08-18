import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'




export default function Home() {
  return (
    <>
    <Head>
      <title>Pagina Principal</title>
      <meta name='keyworkds' content='Roupas, Calçados, Boné'></meta>
      
    </Head>

    <div >
      <h1 className={styles.title}> Hello World Next jS</h1>
    </div>
    </>
    
  )
}
