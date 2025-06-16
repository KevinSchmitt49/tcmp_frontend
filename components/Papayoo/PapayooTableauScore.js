import styles from "../../styles/TableauScore.module.css";
import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AddScore from "./PapayooAddScore";

function TableauScore({ gameId }) {
  const [tableData, setTableData] = useState(null);
  const [totals, setTotals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);

  const router = useRouter();
  const goToResults = () => {
    router.push(`/congratulation/${gameId}`);
  };
  //--------- Récupération et formatage des données ---------
  function formatScores(rawData) {
    const playersSet = new Set();
    const roundsSet = new Set();
    const scores = {};

    rawData.forEach((item) => {
      const playerName = item.players?.name;
      const roundNumber = item.rounds?.number;

      if (!playerName || !roundNumber) return;

      playersSet.add(playerName);
      roundsSet.add(roundNumber);

      scores[playerName] = scores[playerName] || {};
      scores[playerName][roundNumber] = item.points;
    });

    return {
      players: Array.from(playersSet),
      rounds: Array.from(roundsSet).sort((a, b) => a - b),
      scores,
    };
  }

  useEffect(() => {
    if (!gameId) return;

    async function fetchData() {
      const { data: playersData, error: playerError } = await supabase
        .from("players")
        .select("id, name")
        .eq("game_id", gameId);

      if (playerError || !playersData || playersData.length === 0) {
        console.error("Erreur ou aucun joueur trouvé :", playerError);
        return;
      }

      const playerNames = playersData.map((p) => p.name);
      const playerIds = playersData.map((p) => p.id);

      const { data: scoresData, error: scoreError } = await supabase
        .from("scores")
        .select(
          `
          points,
          player_id,
          round_id,
          players ( id, game_id, name ),
          rounds ( id, game_id, number )
        `
        )
        .in("player_id", playerIds);

      if (scoreError) {
        console.error("Erreur chargement scores :", scoreError);
      }

      let formatted = formatScores(scoresData ?? []);
      // console.log("resultat du formated", formatted);
      // console.log("resultat du playerdata", playersData);
      // console.log("resultat du gameID", gameId);

      setTableData(formatted);
      const totalPoints = calculateTotals(
        formatted.players,
        formatted.rounds,
        formatted.scores
      );
      setTotals(totalPoints);
      setShouldReload(false);
    }

    if (gameId && (!tableData || shouldReload)) {
      fetchData();
    }
  }, [gameId, shouldReload]);

  if (!tableData) return <p>Chargement...</p>;

  const { players, rounds, scores } = tableData;

  //--------- Calcul des totaux ---------
  function calculateTotals(players, rounds, scores) {
    return players.map((player) => {
      return rounds.reduce((sum, round) => {
        const point = scores[player]?.[round] ?? 0;
        return sum + point;
      }, 0);
    });
  }

  //--------- Affichage ---------
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
        <h3 className={styles.h3}>Papayoo</h3>
        <a
          href="https://cdn.1j1ju.com/medias/9e/ba/30-papayoo-regle.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className={styles.rulesLeft}>
            <strong>Tu triches !</strong> Voir les règles du jeu
          </p>
        </a>
      </div>
      {/* ------modale score------- */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <AddScore
              gameId={gameId}
              onClose={() => setShowModal(false)}
              onSubmitSuccess={() => setShouldReload(true)}
            />
          </div>
        </div>
      )}
      <div className={styles.containerRight}>
        <header className={styles.cardGame}>
          <img className={styles.imgGame} src="images/papayoo.jpg" />
          <h3 className={styles.text}>Papayoo</h3>
        </header>

        <main className={styles.main}>
          <h2 className={styles.h2}>Tableau des scores</h2>

          <div className={styles.containerTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.column}></th>
                  {players.map((player) => (
                    <th key={player}>{player}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rounds.length > 0 ? (
                  rounds.map((round) => (
                    <tr key={round}>
                      <td className={styles.round}>Manche {round}</td>
                      {players.map((player) => (
                        <td className={styles.scores} key={player}>
                          {scores[player]?.[round] ?? "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={players.length + 1}
                      style={{ textAlign: "center", fontStyle: "italic" }}
                    >
                      Aucune manche jouée pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <th className={styles.totalScores}>Total</th>
                  {totals.map((total, index) => (
                    <td className={styles.totalScores} key={index}>
                      {total}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </main>

        <div className={styles.containerButton}>
          <button
            className={styles.principalButton}
            onClick={() => setShowModal(true)}
          >
            Manche terminée
          </button>
          <p className={styles.rulesRight}>
            <a
              href="https://cdn.1j1ju.com/medias/9e/ba/30-papayoo-regle.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Tu triches !</strong> Voir les règles du jeu
            </a>
          </p>
          <button className={styles.secondaryButton} onClick={goToResults}>
            <span className={styles.gradiantText}>Partie terminée</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableauScore;
