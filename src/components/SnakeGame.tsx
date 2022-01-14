import React, {useEffect, useRef, useState} from 'react';
import {Board} from "./Board";
import './SnakeGame.scss';

export type SquaresRow = Array<{ isSnake: boolean, isApple: boolean }>;
export type Squares = Array<SquaresRow>;

const initialSquaresRow = Array(16).fill({isSnake: false, isApple: false}) as SquaresRow;
const initialSquares = Array(9).fill(initialSquaresRow) as Squares;

const directions = {
    right: "ArrowRight",
    down: "ArrowDown",
    left: "ArrowLeft",
    up: "ArrowUp",
};

export const SnakeGame: React.FC = () => {
    const [squares, setSquares] = useState(initialSquares);

    const [snake, setSnake] = useState({
        coords: Array.of(
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 3, y: 0},
            {x: 4, y: 0}),
        direction: directions.right,
    });

    const [gameStarted, setGameStarted] = useState(false);

    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(function setSquaresWithSnake() {
        setSquares((prevSquares) => {
            const newSquares = prevSquares.map((prevSquaresRow) => {
                return prevSquaresRow.map(() => {
                    return {isSnake: false, isApple: false};
                });
            });

            snake.coords.forEach((coords, index) => {
                newSquares[coords.y][coords.x].isSnake = true;
            });

            return newSquares;
        })
    }, [snake]);

    useEffect(function startGameTimer() {
        if (!gameStarted) {
            return;
        }
        const intervalID = setInterval(() => {
            changeSnakeCoords();
        }, 500);

        return () => {
            clearInterval(intervalID);
        }
    }, [gameStarted, snake]);

    function changeSnakeCoords() {
        setSnake((prevSnake) => {
            const newCoords = () => {
                const newCoords = prevSnake.coords.slice(1);
                const squareCoords = {...prevSnake.coords[prevSnake.coords.length - 1]};

                if (prevSnake.direction === directions.right) squareCoords.x = squareCoords.x + 1;
                if (prevSnake.direction === directions.down) squareCoords.y = squareCoords.y + 1;
                if (prevSnake.direction === directions.left) squareCoords.x = squareCoords.x - 1;
                if (prevSnake.direction === directions.up) squareCoords.y = squareCoords.y - 1;

                newCoords.push(squareCoords);
                return newCoords;
            }
            return {...prevSnake, coords: newCoords()};
        });
    }

    const changeSnakeDirection = (key: string) => {
        const dir = snake.direction;

        if ((key === directions.right && dir !== directions.right && dir !== directions.left) ||
            (key === directions.down && dir !== directions.down && dir !== directions.up) ||
            (key === directions.left && dir !== directions.left && dir !== directions.right) ||
            (key === directions.up && dir !== directions.up && dir !== directions.down)
        ) {
            setSnake((prevSnake) => ({...prevSnake, direction: key}));
        }
    };

    const handleClick = () => {
        if (boardRef.current) {
            boardRef.current.focus();
        }
        setGameStarted((gameStarted) => !gameStarted);
    };

    return (
        <div>
            <Board
                boardRef={boardRef}
                squares={squares}
                onKeyDown={changeSnakeDirection}
            />
            {/*todo: remove br*/}
            <br/>
            <button onClick={handleClick}>
                {(gameStarted) ? 'Pause game' : 'Start game'}
            </button>
        </div>
    );
};
