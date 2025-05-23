import styles from "../styles/ChoiseGame.module.css";
import Tooltip from "../components/Tooltip";
import Link from "next/link";

const gamesList = [
  {
    id: 1,
    name: "Papayoo",
    src: "images/papayoo.jpg",
    disable: false,
  },
  {
    id: 2,
    name: "Uno",
    src: "images/Uno.jpg",
    disable: true,
  },
  {
    id: 3,
    name: "Belote",
    src: "images/belote.jpg",
    disable: true,
  },
  {
    id: 4,
    name: "Tarot",
    src: "images/tarot.jpg",
    disable: true,
  },
  {
    id: 5,
    name: "Dos",
    src: "images/dos.jpg",
    disable: true,
  },
];

const oneGame = (
  <div className={styles.container}>
    {gamesList.map((game) => {
      return (
        <Link href="papayoo">
          <button
            key={game.id}
            className={`${styles.cardGame} ${
              game.disable ? styles.disable : ""
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

function ChoiseGame() {
  return (
    <div>
      <main className={styles.main}>
        <h2>On joue à quoi ?</h2>
        {oneGame}
      </main>
    </div>
  );
}

export default ChoiseGame;
