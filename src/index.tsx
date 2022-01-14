import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {SnakeGame} from "./components/SnakeGame";

ReactDOM.render(
    <React.StrictMode>
        <SnakeGame/>
    </React.StrictMode>,
    document.getElementById('root')
);
