import { useState } from "react";
import styles from "../../styles/Players.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/router";

function PapayooPlayers({ onGo }) {
  const [countInput, setCountInput] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", ""]);

  const router = useRouter();
  const { game_id } = router.query;

  const incrementInput = () => {
    countInput < 9 ? setCountInput(countInput + 1) : "";
  };
  const decrementInput = () => {
    countInput > 1 ? setCountInput(countInput - 1) : "";
  };

  const renderInputs = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <input
        key={i}
        className={styles.input}
        type="text"
        // name={`Player${i + 1}`}
        value={playerNames[i] || ""}
        onChange={(e) => {
          const updated = [...playerNames];
          updated[i] = e.target.value;
          setPlayerNames(updated);
        }}
        required
        minLength="4"
        maxLength="20"
        placeholder={`Prénom du joueur ${i + 1}`}
      />
    ));
  };

  async function handleSubmit() {
    if (!game_id) {
      alert("Identifiant de partie manquant.");
      return;
    }

    const cleanedNames = playerNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (cleanedNames.length < 2) {
      alert("Veuillez entrer au moins 2 noms de joueurs valides.");
      return;
    }

    const playersToInsert = cleanedNames.map((name) => ({
      name,
      game_id, //transmis via URL
    }));

    const { data, error } = await supabase
      .from("players")
      .insert(playersToInsert)
      .select();

    if (error) {
      console.error("Erreur d'insertion :", error);
    } else {
      console.log("Joueurs enregistrés :" /*, data*/);
      // redirection ou confirmation ici si besoin
    }
    if (!error) {
      onGo(game_id); // 👉 monte PapayooTableauScore depuis le parent
    }
  }

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
          {renderInputs(countInput, playerNames, setPlayerNames)}
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
          <button className={styles.principalButton} onClick={handleSubmit}>
            Go !
          </button>
        </main>
      </div>
    </div>
  );
}

export default PapayooPlayers;
