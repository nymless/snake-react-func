import React from 'react'
import { Square } from './Square'
import { Squares } from './SnakeGame'

interface BoardProps {
    squares: Squares
    tailBitten: boolean
    borderCrossed: boolean
}

export const Board: React.FC<BoardProps> = (props) => {
    return (
        <div className="board">
            {props.squares.map((rowSquare, rowIndex) => {
                return rowSquare.map((square, index) => {
                    return (
                        <Square
                            key={String(rowIndex) + String(index)}
                            isSnake={square.isSnake}
                            isSnakeEnd={square.isSnakeEnd}
                            isSnakeHead={square.isSnakeHead}
                            isApple={square.isApple}
                        />
                    )
                })
            })}
            {(props.tailBitten || props.borderCrossed) && (
                <div className="gameOver">Game Over</div>
            )}
        </div>
    )
}
