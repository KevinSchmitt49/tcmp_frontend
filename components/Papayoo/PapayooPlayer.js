import { useState } from "react";
import styles from "../../styles/Players.module.css";

const renderInputs = (count) => {
  return Array.from({ length: count }, (_, i) => (
    <input
      key={i}
      className={styles.input}
      type="text"
      name={`Player${i + 1}`}
      required
      minLength="4"
      maxLength="20"
      placeholder={`Prénom du joueur ${i + 1}`}
    />
  ));
};

function PapayooPlayers() {
  const [countInput, setCountInput] = useState(2);

  const incrementInput = () => {
    countInput < 9 ? setCountInput(countInput + 1) : "";
  };
  const decrementInput = () => {
    countInput > 1 ? setCountInput(countInput - 1) : "";
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src="/images/papayoo5.jpg"
          alt="amis qui joue au papayoo"
          className={styles.image}
        />
        <img
          src="/logo_TCMP.png"
          alt="logo tu comptes mes points"
          className={styles.logo}
        />
        <h3 className={styles.h3}>Papayoo</h3>
      </div>
      <div className={styles.containerRight}>
        <header className={styles.cardGame}>
          <img className={styles.imgGame} src="images/papayoo.jpg" />
          <h3 className={styles.text}> Papayoo </h3>
        </header>
        <main className={styles.main}>
          <h2 className={styles.h2}>Nom des joueurs</h2>
          {renderInputs(countInput)}
          <div className={styles.containerButton}>
            <button
              className={styles.buttonDelete}
              onClick={() => decrementInput()}
            >
              <span className={styles.gradiantText}>-</span>
            </button>
            <button
              className={styles.buttonAdd}
              onClick={() => incrementInput()}
            >
              {" "}
              +{" "}
            </button>
          </div>
          <button className={styles.principalButton}>Go !</button>
        </main>
      </div>
    </div>
  );
}

export default PapayooPlayers;
