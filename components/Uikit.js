import styles from "../styles/Uikit.module.css";

function Uikit() {
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>UI KIT</h1>
        <button className={styles.principalButton}>Bouton principal</button>
        <button className={styles.secondaryButton}>
          <span className={styles.gradiantText}>Bouton secondaire</span>
        </button>
        <h2> Titre H2 </h2>
        <div className={styles.cardGame}>
          <h3> Titre H3 </h3>
        </div>
        <div className={`${styles.cardGame} ${styles.disable}`}>
          <h3> Titre H3 </h3>
        </div>
        <input
          className={styles.input}
          type="text"
          name="name"
          required
          minlength="4"
          maxlength="20"
          placeholder="Prénom"
        />
        <input
          className={styles.input}
          type="text"
          name="name"
          required
          minlength="4"
          maxlength="20"
          placeholder="Prénom"
        />
      </main>
    </div>
  );
}

export default Uikit;
