import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import GameOfLife from './GameOfLife/GameOfLife';



ReactDOM.render(
  <React.StrictMode>
    <GameOfLife/>
  </React.StrictMode>,
  document.getElementById('root')
);

