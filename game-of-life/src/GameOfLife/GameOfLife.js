// import react
import React from 'react';
// import style sheet
import './GameOfLife.scss';

// create class GameofLife using react component
export default class GameofLife extends React.Component {

    //sets grid size
    static grid = {
        columns: 25,
        rows: 25
    }

    // defines the 2 possible states of the cells
    static cellState = {
        ON: true,
        OFF: false
    }  
  
  
    // creates state for the initialized cells
    constructor(props){
        super(props);
        this.state ={
            cells: this.initializedCells()
        }
    }
  
    // creates state for the generation count
    // constructor() {
    //     super();
    //     this.state = {
    //         generations: 0
    //     }
    // }
    
    // initializes cells
    initializedCells() {
        // 2d boolean array
        let cells = [];

        // fills the grid
        for(let colIndex = 0; colIndex < GameofLife.grid.columns; colIndex++){
            // fills column with an empty array
            cells[colIndex] = [];
            for(let rowIndex = 0; rowIndex < GameofLife.grid.rows; rowIndex++){
                // populates the cell 
                cells[colIndex][rowIndex] = GameofLife.cellState.OFF;
            }
        }

        return cells;
    }
    

    // renders this component
    render(){
        return (
            <div className="GameOfLife">
                {this.rendercells()}
            </div>
        )
    }

    // renders the cells in the grid
    rendercells(){
        return (
            <div className="game_cells">
                cells
            </div>
        )
    }
}

