import PapayooPlayers from "../components/Papayoo/PapayooPlayer";
import TableauScore from "../components/Papayoo/PapayooTableauScore";
import AddScore from "../components/Papayoo/PapayooAddScore";
import { useState } from "react";

function PapayooGame() {
  const [showScoreTable, setShowScoreTable] = useState(false);
  const [gameId, setGameId] = useState(null);

  return (
    <>
      {showScoreTable ? (
        <TableauScore gameId={gameId} />
      ) : (
        <PapayooPlayers
          onGo={(gameIdFromForm) => {
            setGameId(gameIdFromForm);
            setShowScoreTable(true);
          }}
        />
      )}
    </>
  );
}

export default PapayooGame;
