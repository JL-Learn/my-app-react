import React from "react";
import ReactDOM from "react-dom";
import './index.css';

/* ============================== Tic-Tac-Toe Game ========================================
    A tic-tac-toe game that:

    + Lets you play tic-tac-toe,
    + Indicates when a player has won the game,
    + Stores a game’s history as a game progresses,
    + Allows players to review a game’s history and see previous versions of a game’s board.
============================================================================================*/

// Square Component 
function Square(props) {

    return(

        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

// Board Component 
class Board extends React.Component {

    // Method renderSquare
    renderSquare(i) {

        return(

            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {

        return(

            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>

                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>

                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// Game Component 
class Game extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    // Method jumpTo
    jumpTo(step) {

        this.setState({

            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    // Method handleClick
    handleClick(i) {

        /* this.state.history.slice(0, this.state.stepNumber + 1). 
        This ensures that if we “go back in time” and then make 
        a new move from that point, we throw away all the “future” 
        history that would now become incorrect. */
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if(calculateWinner(squares) || squares[i]) {

            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({

            history: history.concat([{

                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        /* As we iterate through history array, step variable 
        refers to the current history element value, and move 
        refers to the current history element index. We are only 
        interested in move here, hence step is not getting 
        assigned to anything. */
        const moves = history.map((step, move) => {

            const desc = move ? 'Go to move #' + move : 'Go to game start';
            
            return(

                /* For each move in the tic-tac-toe game’s history, 
                we create a list item <li> which contains a button 
                <button>. The button has a onClick handler which 
                calls a method called this.jumpTo() */
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            );
        });

        let status;

        if(winner) {

            status = 'Winner: ' + winner;
        } else {

            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return(

            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>

                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(

    <Game />,
    document.getElementById('root')
);

// Function to know who won the game
/* We will call calculateWinner(squares) in the Board’s render
 function to check if a player has won. If a player has won, 
 we can display text such as “Winner: X” or “Winner: O”.*/
function calculateWinner(squares) {

    /* Given an array of 9 squares, this function will 
    check for a winner and return 'X', 'O', or null as appropriate. */

    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {

        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

            return squares[a];
        }
    }
    return null;
}