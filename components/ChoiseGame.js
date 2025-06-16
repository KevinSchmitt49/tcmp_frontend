import styles from "../styles/ChoiseGame.module.css";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function ChoiseGame() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  // Chargement des données au montage du composant
  useEffect(() => {
    async function getGamesList() {
      const { data, error } = await supabase.from("games-list").select("*");
      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        setGames(data);
      }
      setLoading(false);
    }

    getGamesList();
  }, []);

  if (loading) return <p className={styles.loading}>Chargement...</p>;

  // console.log(games);

  async function postNewGame(nomPartie) {
    const { data, error } = await supabase
      .from("games")
      .insert([{ name: nomPartie }])
      .select(); // retourne les données insérées

    if (error) {
      console.error("Erreur à l'insertion :", error);
    } else {
      // console.log("Partie ajoutée :", data);
      const gameId = data[0].id;
      router.push(`/papayoo?game_id=${gameId}`);
    }
  }

  const game = (
    <div className={styles.containerGame}>
      {games.map((game) => {
        return (
          <Link href={game.name.toLowerCase()} key={game.id}>
            <button
              onClick={() => postNewGame(game.name)}
              disabled={!game.enable}
              className={`${styles.cardGame} ${
                game.enable ? "" : styles.disable
              }`}
            >
              <img className={styles.imgGame} src={game.src} />
              <h3 className={styles.text}> {game.name} </h3>
            </button>
          </Link>
        );
      })}
    </div>
  );
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src="/images/Uno.jpg"
          alt="amis qui joue aux cartes"
          className={styles.image}
        />
        <img
          src="/logo_TCMP.png"
          alt="logo tu comptes mes points"
          className={styles.logo}
        />
      </div>
      <main className={styles.main}>
        <h2>On joue à quoi ?</h2>
        {game}
      </main>
    </div>
  );
}

export default ChoiseGame;
