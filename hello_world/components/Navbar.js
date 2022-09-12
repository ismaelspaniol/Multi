import Link from 'next/link'
import styles from '../styles/Navbar.module.css'
import { supabase } from '../utils/supabaseClient'


export default function Navbar() {
    return (
        <ul className={styles.navbar}>
            <li><Link href="/"><a>Home</a></Link></li>
            <li><Link href="/todos"><a>Todos</a></Link></li>
            <li><Link href="/products"><a>Produtos</a></Link></li>
            <li> <Link href="/about"><a>Sobre</a></Link></li>
            <li> <Link href="/contact"><a>Contato</a></Link></li>
            <li> <Link href="/pares"><a>Pares</a></Link></li>
            <li> <button
                    className="button block"
                    onClick={() => supabase.auth.signOut()}
                    >
                    Sign Out
                    </button></li>

        </ul>
    )
}