import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>Pagina Principal</title>
        <meta name='keyworkds' content='Roupas, Calçados, Boné'></meta>
        <meta name="description" content="Encontre a melhor roupa para você" ></meta>

      </Head>

      <div >
        <h1 className={styles.title}> Hello World Next jsS</h1>
        <Image src="/images/city.jpg" width="400px" height="300px" alt="Cidade a noite" />
      </div>
    </>

  )
}



