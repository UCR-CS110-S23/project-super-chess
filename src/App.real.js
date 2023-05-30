import './App.css';
import React, {useState} from "react";
import Chessboard from "chessboardjsx";
import {Chess} from "chess.js";


function SuperChess(){
    const[chess] = useState(
        new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    );

    const[fen, setFen] = useState(chess.fen());

    const handleMove = (move) => {
        if(chess.move(move)){
            setTimeout(() => {
                const moves = chess.moves();

                if(move.length > 0){
                    const computerMove = moves[Math.floor(Math.random()) * moves.length];
                    chess.move(computerMove);
                    setFen(chess.fen());
                }
            }, 300)
            setFen(chess.fen());
        }
    };


    return (
        <div className="flex-center">
            <h1>CS110 Super Chess Project</h1>
            <Chessboard
                width={400}
                position={fen}
                onDrop={(move) =>
                    handleMove({from: move.sourceSquare, to: move.targetSquare, promotion: "q"})
                }
            />
        </div>
    )

}

function App() {





  return (
      <div>
      <div className = "flex-left">
          <label htmlFor="uname1"><b>Player 1 Username</b></label>
          <input type="text" placeholder="Enter Username" name = "uname1" required/>
            <br/>
          <label htmlFor="pword"><b>Player 1 Password</b></label>
          <input type="password1" placeholder="Enter Password" name="password1" required/>

          <button type = "submit">Login</button>
      </div>
      <SuperChess/>
          <div className="flex-right">
              <label htmlFor="uname2"><b>Player 2 Username</b></label>
              <input type="text" placeholder="Enter Username" name="uname2" required/>
              <br/>
              <label htmlFor="pword"><b>Player 2 Password</b></label>
              <input type="password2" placeholder="Enter Password" name="password2" required/>

              <button type="submit">Login</button>
          </div>

      </div>
  );
}

export default App;
