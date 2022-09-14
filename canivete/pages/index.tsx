import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Pagina Principal</title>
        <meta name='keyworkds' content='Contrle de trades, bitcoin, etherium'></meta>        
      </Head>

      <div >
        <h1 className={styles.title}> Bem vindo ao controle de trades</h1>
        <Image src="/images/city.jpg" width="400px" height="300px" alt="Cidade a noite" />
      </div>
    </>

  )
}



