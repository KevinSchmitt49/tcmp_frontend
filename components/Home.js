import styles from "../styles/Home.module.css";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect } from "react";

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src="/images/Uno.jpg"
          alt="amis qui joue aux cartes"
          className={styles.image}
        />
      </div>
      <main className={styles.main}>
        <img
          src="/logo_TCMP.png"
          alt="logo tu comptes mes points"
          className={styles.logoPrincipal}
        />
        <Link href="/game">
          <button className={styles.principalButton}>Commencer !</button>
        </Link>
      </main>
    </div>
  );
}

export default Home;
