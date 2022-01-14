import React, {KeyboardEventHandler, RefObject} from 'react';
import {Square} from "./Square";
import {Squares} from "./SnakeGame";

interface BoardProps {
    squares: Squares,
    onKeyDown: (key: string) => void,
    boardRef: RefObject<HTMLDivElement>
}

export const Board: React.FC<BoardProps> = (props) => {
    const handleKeyDown: KeyboardEventHandler = (event) => {
        props.onKeyDown(event.key)
    }

    return (
        <div className="board" ref={props.boardRef} tabIndex={1} onKeyDown={handleKeyDown}>
            {props.squares.map((rowSquare, rowIndex) => {
                return rowSquare.map((square, index) => {
                    return (
                        <Square
                            key={String(rowIndex) + String(index)}
                            isSnake={square.isSnake}
                            isApple={square.isApple}
                        />
                    )
                });
            })}
        </div>
    );
}
