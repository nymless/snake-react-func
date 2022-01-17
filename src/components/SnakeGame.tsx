import React, { useEffect, useState } from 'react'
import { Board } from './Board'
import './SnakeGame.scss'
import { getRandomInt } from '../utils/getRandomInt'

const enum directions {
    right = 'ArrowRight',
    down = 'ArrowDown',
    left = 'ArrowLeft',
    up = 'ArrowUp',
}

export type SquaresRow = Array<{
    isSnake: boolean
    isSnakeHead: boolean
    isSnakeEnd: boolean
    isApple: boolean
}>
export type Squares = Array<SquaresRow>

const initialSquaresRow = Array(16).fill({
    isSnake: false,
    isSnakeHead: false,
    isSnakeEnd: false,
    isApple: false,
}) as SquaresRow
const initialSquares = Array(9).fill(initialSquaresRow) as Squares

const initialSnake = {
    coords: Array.of({ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }),
    direction: directions.right,
}

const initialApple = { x: 8, y: 4 }

export const SnakeGame: React.FC = () => {
    const [squares, setSquares] = useState(initialSquares)
    const [snake, setSnake] = useState(initialSnake)
    const [apple, setApple] = useState(initialApple)
    const [appleEaten, setAppleEaten] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [directionChanged, setDirectionChanged] = useState(false)
    const [tailBitten, setTailBitten] = useState(false)
    const [borderCrossed, setBorderCrossed] = useState(false)
    const [scoreCount, setScoreCount] = useState(0)

    function resetState() {
        setSquares(initialSquares)
        setSnake(initialSnake)
        setApple(initialApple)
        setAppleEaten(false)
        setGameStarted(false)
        setDirectionChanged(false)
        setTailBitten(false)
        setBorderCrossed(false)
        setScoreCount(0)
    }

    useEffect(
        function addRemoveKeydownListener() {
            const handleKeydown = function handleKeydown(event: KeyboardEvent) {
                // condition to change direction on first keydown only
                if (directionChanged) {
                    return
                }
                const dir = snake.direction
                // conditions not to change direction for 180 degrees
                if (
                    (event.key === directions.right &&
                        dir !== directions.right &&
                        dir !== directions.left) ||
                    (event.key === directions.down &&
                        dir !== directions.down &&
                        dir !== directions.up) ||
                    (event.key === directions.left &&
                        dir !== directions.left &&
                        dir !== directions.right) ||
                    (event.key === directions.up &&
                        dir !== directions.up &&
                        dir !== directions.down)
                ) {
                    setDirectionChanged(true)
                    setSnake((prev) => ({
                        ...prev,
                        direction: event.key as directions,
                    }))
                }
            }

            if (gameStarted) {
                document.addEventListener('keydown', handleKeydown)
            }

            return () => {
                document.removeEventListener('keydown', handleKeydown)
            }
        },
        [gameStarted, directionChanged, snake]
    )

    useEffect(
        function stopGame() {
            if (tailBitten || borderCrossed) {
                setGameStarted(false)
            }
        },
        [tailBitten, borderCrossed]
    )

    useEffect(
        function generateAppleIfEaten() {
            if (appleEaten) {
                let newApple = { x: getRandomInt(0, 16), y: getRandomInt(0, 9) }
                let appleMaybeOnSnakeSquares = true

                outer: while (appleMaybeOnSnakeSquares) {
                    for (let i = 0; i < snake.coords.length; i++) {
                        if (
                            newApple.x === snake.coords[i].x &&
                            newApple.y === snake.coords[i].y
                        ) {
                            newApple = {
                                x: getRandomInt(0, 16),
                                y: getRandomInt(0, 9),
                            }
                            continue outer
                        }
                    }
                    appleMaybeOnSnakeSquares = false
                }
                setApple(newApple)
                setAppleEaten(false)
            }
        },
        [appleEaten, snake]
    )

    useEffect(
        function setSquaresWithSnakeAndApple() {
            const snakeHead = snake.coords[snake.coords.length - 1]
            if (
                snakeHead.x <= -1 ||
                snakeHead.y <= -1 ||
                snakeHead.x >= 16 ||
                snakeHead.y >= 9
            ) {
                setBorderCrossed(true)
                return
            }

            setSquares((prevSquares) => {
                if (prevSquares[snakeHead.y][snakeHead.x].isSnake) {
                    setTailBitten(true)
                }

                const newSquares = prevSquares.map((prevSquaresRow) => {
                    return prevSquaresRow.map(() => {
                        return {
                            isSnake: false,
                            isSnakeHead: false,
                            isSnakeEnd: false,
                            isApple: false,
                        }
                    })
                })

                snake.coords.forEach((coords, index, array) => {
                    if (index === 0) {
                        newSquares[coords.y][coords.x].isSnakeEnd = true
                    } else if (index === array.length - 1) {
                        newSquares[coords.y][coords.x].isSnakeHead = true
                    } else {
                        newSquares[coords.y][coords.x].isSnake = true
                    }
                })

                newSquares[apple.y][apple.x].isApple = true

                return newSquares
            })
        },
        [snake.coords, apple]
    )

    useEffect(
        function intervalChangeSnakeCoords() {
            if (!gameStarted) {
                return
            }

            const intervalID = setInterval(() => {
                if (directionChanged) {
                    setDirectionChanged(false)
                }

                setSnake((prevSnake) => {
                    const calcNewCoords = () => {
                        const newSnakeHead = {
                            ...prevSnake.coords[prevSnake.coords.length - 1],
                        }

                        if (prevSnake.direction === directions.right)
                            newSnakeHead.x = newSnakeHead.x + 1
                        if (prevSnake.direction === directions.down)
                            newSnakeHead.y = newSnakeHead.y + 1
                        if (prevSnake.direction === directions.left)
                            newSnakeHead.x = newSnakeHead.x - 1
                        if (prevSnake.direction === directions.up)
                            newSnakeHead.y = newSnakeHead.y - 1

                        let snakeEatsApple
                        if (
                            newSnakeHead.x === apple.x &&
                            newSnakeHead.y === apple.y
                        ) {
                            setAppleEaten(true)
                            snakeEatsApple = true
                        }

                        let newSnake
                        if (snakeEatsApple) {
                            newSnake = prevSnake.coords.slice()
                        } else {
                            newSnake = prevSnake.coords.slice(1)
                        }

                        newSnake.push(newSnakeHead)
                        return newSnake
                    }
                    const newCoords = calcNewCoords()

                    return { ...prevSnake, coords: newCoords }
                })
            }, 500)

            return () => {
                clearInterval(intervalID)
            }
        },
        [gameStarted, directionChanged, apple]
    )

    useEffect(
        function scoreCount() {
            if (appleEaten) {
                setScoreCount((prev) => prev + 1)
            }
        },
        [appleEaten]
    )

    const handleClickStart = () => {
        setGameStarted((gameStarted) => !gameStarted)
    }

    const handleClickReset = () => {
        resetState()
    }

    return (
        <div className="snakeGame">
            <Board
                tailBitten={tailBitten}
                borderCrossed={borderCrossed}
                squares={squares}
            />
            <div className="gameInfo">
                {borderCrossed || tailBitten ? (
                    <div
                        className="startButton"
                        tabIndex={1}
                        onClick={handleClickReset}
                    >
                        Reset game
                    </div>
                ) : (
                    <div
                        className="startButton"
                        tabIndex={1}
                        onClick={handleClickStart}
                    >
                        {gameStarted ? 'Pause game' : 'Start game'}
                    </div>
                )}
                <div className="score">
                    <img
                        className="apple"
                        src={require('../images/Apple.png')}
                        alt="apple"
                    />
                    <div>{'- ' + scoreCount}</div>
                </div>
            </div>
        </div>
    )
}
