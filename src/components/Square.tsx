import React from 'react';
import classNames from 'classnames';

interface SquareProps {
    isSnake: boolean,
    isApple: boolean,
}

export const Square: React.FC<SquareProps> = (props) => {
    return (
        <div
            className={classNames(
                'square',
                {'snake': props.isSnake},
                {'apple': props.isApple},
            )}
        />
    );
}
