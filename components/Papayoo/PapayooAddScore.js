import styles from "../../styles/AddScore.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

function AddScore({ gameId, onClose, onSubmitSuccess }) {
  const [tablePlayer, setTablePlayer] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    async function getScores() {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("game_id", gameId);

      if (error) {
        console.error("Erreur récupération des joueurs :", error);
        return;
      }
      setTablePlayer(data);
    }

    if (gameId) {
      getScores();
    }
  }, [gameId]);

  const handleScoreChange = (playerId, value) => {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue) || intValue < 0) return;

    setScores((prevScores) => ({
      ...prevScores,
      [playerId]: intValue,
    }));
  };

  const totalDistributed = Object.values(scores).reduce(
    (acc, val) => acc + val,
    0
  );
  const remaining = 250 - totalDistributed;

  const scoreInput = tablePlayer.map((player) => {
    const currentScore = scores[player.id] ?? "";
    const maxAllowed = remaining + (scores[player.id] || 0);

    return (
      <div key={player.id} className={styles.containerInput}>
        <span className={styles.player}>{player.name}</span>
        <div>
          <input
            className={styles.input}
            type="number"
            min="0"
            max={maxAllowed}
            value={currentScore}
            required
            onChange={(e) => handleScoreChange(player.id, e.target.value)}
            placeholder="-"
          />
          <span> points</span>
        </div>
      </div>
    );
  });

  const handleSubmit = async () => {
    if (remaining !== 0) {
      alert("Tous les points n'ont pas été distribués !");
      return;
    }
    // Étape 1 : compter les manches existantes pour ce game_id
    const { count, error: countError } = await supabase
      .from("rounds")
      .select("*", { count: "exact", head: true })
      .eq("game_id", gameId);

    if (countError) {
      console.error("Erreur lors du comptage des manches :", countError);
      return;
    }

    const roundNumber = (count ?? 0) + 1;

    // Étape 2 : créer une nouvelle manche
    const { data: newRound, error: roundError } = await supabase
      .from("rounds")
      .insert([{ game_id: gameId, number: roundNumber }])
      .select()
      .single();

    if (roundError || !newRound) {
      console.error("Erreur création de la manche :", roundError);
      return;
    }

    const roundId = newRound.id;

    // Étape 3 : préparer les scores à insérer
    const scoresToInsert = Object.entries(scores).map(([playerId, points]) => ({
      player_id: playerId,
      round_id: roundId,
      points: points,
    }));

    const { error: insertError } = await supabase
      .from("scores")
      .insert(scoresToInsert);

    if (insertError) {
      console.error("Erreur d'insertion des scores :", insertError);
      return;
    }

    // Étape 3 : nettoyage et fermeture
    // alert("Scores enregistrés !");
    setScores({});
    onClose(); // ferme la modale
    onSubmitSuccess(); // notifie TableauScore de recharger
  };

  return (
    <div className={styles.containerRight}>
      <main className={styles.main}>
        <h2 className={styles.h2}>Alors t'as combien ?</h2>
        {scoreInput}
        <p
          className={styles.remaining}
          // style={{ fontSize: remaining < 0 ? "2rem" : "inherit" }}
        >
          Il reste {remaining} points à distribuer.
        </p>
        <p
          className={`${styles.erreurPoints} ${
            remaining < 0 ? "" : styles.none
          }`}
        >
          {remaining < 0
            ? "Attention il y a une erreur : trop de points distribués !!!"
            : ""}
        </p>
      </main>
      <div className={styles.containerButton}>
        <button
          className={`${styles.principalButton} ${
            remaining !== 0 ? styles.disabled : ""
          }`}
          onClick={handleSubmit}
          disabled={remaining !== 0}
        >
          <span>Valider</span>
        </button>
        <button onClick={onClose} className={styles.secondaryButton}>
          <span className={styles.gradiantText}>Annuler</span>
        </button>
      </div>
    </div>
  );
}

export default AddScore;
