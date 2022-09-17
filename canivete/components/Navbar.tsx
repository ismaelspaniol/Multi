import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import { supabase } from '../utils/supabase'


export default function Navbar() {
    return (
        // <header className={styles.header}>        
        //     <nav className={styles.nav}>
        //         <div>
        //             <Link href="/"><a className={styles.active}>Home</a></Link>
        //             <Link href="/pares"><a>Pares</a></Link>
        //             <Link href="/trade"><a>Trades</a></Link>                    
        //         </div>
        //         <div className={styles.topnavright}>
        //                 <a href="#search">Search</a>
        //                 <a href="#" onClick={() => supabase.auth.signOut()}>Logout</a>
        //         </div>
        //     </nav>
        // </header>

        <nav className={styles.nav}>
        <div className={styles.logo}>          
          <Link href="/"><a className={styles.navitem}>Home</a></Link>
          <Link href="/pares"><a className={styles.navitem}>Pares</a></Link>
          <Link href="/trade"><a className={styles.navitem}>Trades</a></Link>
        </div>
        <ul className={styles.navlinks}>          
          <li ><a className={styles.navitem} href="#" onClick={() => supabase.auth.signOut()}>Logout</a></li>
        </ul>
      </nav>
    )
}