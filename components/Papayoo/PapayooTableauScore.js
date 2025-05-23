import styles from "../../styles/TableauScore.module.css";
import { supabase } from "../../lib/supabaseClient";

function TableauScore() {
  async function getScores() {
    const { data, error } = await supabase.from("scores").select(`
      points,
      player_id,
      round_id,
      players ( id, name ),
      rounds ( id, number )
    `);

    if (error) console.error(error);
    return data;
  }

  console.log(getScores());

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src="/images/papayoo5.jpg"
          alt="amis qui joue aux cartes"
          className={styles.image}
        />
        <img
          src="/logo_TCMP.png"
          alt="logo tu comptes mes points"
          className={styles.logo}
        />
      </div>
      <div className={styles.containerRight}>
        <header className={styles.cardGame}>
          <img className={styles.imgGame} src="images/papayoo.jpg" />
          <h3 className={styles.text}> Papayoo </h3>
        </header>
        <main className={styles.main}>
          <h2 className={styles.h2}>Tableau des scores</h2>
          <div className={styles.containerTable}></div>
        </main>
        <div className={styles.containerButton}>
          <button className={styles.principalButton}>Manche terminée</button>
          <p>
            <strong>Tu triches !</strong> Voir les règles du jeu
          </p>
          <button className={styles.secondaryButton}>
            <span className={styles.gradiantText}>Partie terminée</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableauScore;
