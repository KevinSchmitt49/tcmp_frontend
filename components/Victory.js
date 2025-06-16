import styles from "../styles/Victory.module.css";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import confetti from "canvas-confetti";
import Link from "next/link";

function Victory() {
  const router = useRouter();
  const { gameId } = router.query;
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      const { data, error } = await supabase
        .from("scores")
        .select("points, player_id, players(name)")
        .eq("players.game_id", gameId)
        .order("points", { ascending: true });

      if (error) {
        console.error("Erreur récupération des scores :", error);
        return;
      }
      const validData = data.filter((row) => row.players !== null);

      const totals = {};
      //   console.log(validData);
      for (const row of validData) {
        const playerId = row.player_id;
        if (!totals[playerId]) {
          totals[playerId] = {
            name: row.players.name,
            total: 0,
          };
        }
        totals[playerId].total += row.points;
      }

      const sorted = Object.values(totals).sort((a, b) => a.total - b.total);
      setRanking(sorted);
      setLoading(false);
    }

    fetchScores();
  }, [gameId]);

  //-------------Confettis-------------------
  const intervalRef = useRef(null);

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 90),
        particleCount: randomInRange(100, 300),
        origin: { x: 0.5, y: 0.5 },
      });
    }, 1000);
    return () => {
      clearInterval(intervalRef.current); // Nettoyage à la fin
    };
  }, []);

  const stopConfetti = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  const handleRestartGame = () => {
    stopConfetti();
    // logique pour recommencer une partie...
  };

  //   console.log(ranking);

  const rankingFourAndMore = ranking.slice(3);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className={styles.container}>
      {ranking.length > 0 && (
        <main className={styles.main}>
          <div className={styles.textContainer}>
            <p>Bravo</p>
            <p>{ranking[0].name}</p>
            <p>t'es un(e) champion(ne) !</p>
            <p> ({ranking[0].total} points)</p>
          </div>
          {ranking.length < 3 ? (
            ""
          ) : (
            <div className={styles.podium}>
              <div className={styles.oneTwoThree}>
                <img src="/images/podium2.png" className={styles.image} />
                <div className={styles.second}>{ranking[1].name}</div>
                <div className={styles.third}>{ranking[2].name}</div>
                <img src="/images/light.png" className={styles.light} />
              </div>
              <div className={styles.tableau}>
                <ol start="4">
                  {rankingFourAndMore.map((joueur, index) => (
                    <li key={index}>
                      {joueur.name} – {joueur.total} points
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          <Link href="/">
            <button
              className={styles.principalButton}
              onClick={handleRestartGame}
            >
              <span>Recommencer une partie</span>
            </button>
          </Link>
        </main>
      )}
    </div>
  );
}

export default Victory;
