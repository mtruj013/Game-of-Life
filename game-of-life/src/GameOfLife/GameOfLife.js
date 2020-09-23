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
    constructor() {
        super();

        this.state = {
            cells: this.initializedCells(), 
            isGameRunning: false
        }

        // calls the live function each second
        setInterval(() => this.life(), 500)
    }


    // initializes cells
    initializedCells() {
        // 2d boolean array
        let cells = [];

        // fills the grid
        for (let colIndex = 0; colIndex < GameofLife.grid.columns; colIndex++) {
            // fills column with an empty array
            cells[colIndex] = [];
            for (let rowIndex = 0; rowIndex < GameofLife.grid.rows; rowIndex++) {
                // populates the cell 
                cells[colIndex][rowIndex] = GameofLife.cellState.OFF;
            }
        }
        return cells;
    }

    // this function updates the cells being displayed
    life() {
        if(!this.state.isGameRunning){
            return;
        }

        const newCells = [];
        
        // fills grid
        for(let colIndex = 0; colIndex < GameofLife.grid.columns; colIndex++){
            // fills column with an empty array
            newCells[colIndex] = [];
            for(let rowIndex = 0; rowIndex < GameofLife.grid.rows; rowIndex++){
                // populates new cells
                newCells[colIndex][rowIndex] = this.computeNewCellState(colIndex, rowIndex)
            }
        }

        this.setState({cells: newCells})
    }

    // logic for updating the cell state while game is running 
    computeNewCellState(colIndex, rowIndex) {
        const onCells = this.computeNeighbors(colIndex, rowIndex);

        const currentCellState = this.state.cells[colIndex][rowIndex];

        //GAME RULES IMPLEMENTED
        if (currentCellState === GameofLife.cellState.ON) {
            // Any live cell with fewer than two live neighbors dies.
            if (onCells < 2) {
                return GameofLife.cellState.OFF;
            // Any live cell with two or three live neighbors lives on to the next generation.
            } else if (onCells === 2 || onCells === 3){
                return GameofLife.cellState.ON;
            // Any live cell with more than three live neighbours dies.
            } else if (onCells > 3) {
                return GameofLife.cellState.OFF        
            }
        } else {
            // Any dead cell with exactly three live neighbours becomes a live cell.
            if (onCells === 3) {
                return GameofLife.cellState.ON;
            }
        }

        return GameofLife.cellState.OFF;

    }

    // logic for neighbor cells 
    computeNeighbors(colIndex, rowIndex){

        // counter for cells that are on
        let onCells = 0;

        // array of all possible offsets
        const neighborOffsets = [
            [-1, 0], // left
            [-1, 1], // top left
            [0, 1], // top
            [1, 1], // top right
            [1, 0], // right
            [1, -1], //bottom right
            [0, -1], // bottom
            [-1, -1] // bottom left
        ];
        
        // iterate over array of offsets
        for (const neighborOffsetKey in neighborOffsets) {
        
            // apply them 
            let [offSetX, offSetY] = neighborOffsets[neighborOffsetKey];
            // column offset
            let newColOffset = colIndex + offSetX;
            // row offset
            let newRowOffset = rowIndex + offSetY;
        
            // checks grid boundries
            if (newColOffset < 0 || newColOffset > GameofLife.grid.columns - 1) {
                continue;
            }
            if (newRowOffset < 0 || newRowOffset > GameofLife.grid.rows - 1){
                continue;
            }
                    
            // set neighbors state
            const neighborState = this.state.cells[newColOffset][newRowOffset];
        
            // checks if neighbor is ON
            if (neighborState === GameofLife.cellState.ON) {
                // add it to the count
                onCells++;
            }
        }
        
        return onCells;
    }


    // toggles cells 
    toggleCellState(colIndex, rowIndex) {
        const newState = this.state.cells;

        newState[colIndex][rowIndex] = !newState[colIndex][rowIndex];

        this.setState({ state: newState })
    }

    // toggle game state
    toggleGameState() {
        this.setState({ isGameRunning: !this.state.isGameRunning })
    }


    // renders the cells in the grid
    rendercells() {
        return (
            <div className="game_cells">
                {this.state.cells.map((rows, colIndex) => {
                    return this.renderColumns(rows, colIndex)
                })}
            </div>
        )
    }

    //render columns
    renderColumns(rows, colIndex) {
        return (
            <div className="column" key={`column_${colIndex}`}>
                {rows.map((cellState, rowIndex) => {
                    const cellModifier = cellState === GameofLife.cellState.OFF ? 'off' : 'on'
                    return <div
                        className={`cell cell--${cellModifier}`}
                        key={`cell_${colIndex}_${rowIndex}`}
                        onClick={() => this.toggleCellState(colIndex, rowIndex)}
                    />
                })}
            </div>
        )
    }

    //render start button
    renderStartButton() {
        // toggle the label depending on game state
        const buttonLabel = this.state.isGameRunning ? 'Stop' : 'Start';

        return (
            <button
                className="start_button"
                onClick={() => this.toggleGameState()}>
                    {buttonLabel}
            </button>
        )
    }

    // renders this component
    render() {
        return (
            <div className="GameOfLife">
                {this.rendercells()}
                {this.renderStartButton()}
            </div>
        )
    }
}

