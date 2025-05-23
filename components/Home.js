import styles from "../styles/Home.module.css";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect } from "react";

function Home() {
  // ---------------test connection Base de donnée supabase ---------------
  // useEffect(() => {
  //   const testDB = async () => {
  //     const { data, error } = await supabase.from("score").select("*");
  //     if (error) {
  //       console.error("❌ Erreur de connexion à Supabase :", error.message);
  //     } else {
  //       console.log("✅ Connexion OK. Exemple de donnée :", data);
  //     }
  //   };

  //   testDB();
  // }, []);
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
