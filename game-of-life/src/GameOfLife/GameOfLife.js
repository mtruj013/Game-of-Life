// import react
import React from 'react';
// import style sheet
import './GameOfLife.scss';
//import presets
import blinker_2 from './gifs/blinker_2.gif'
import blinker_3 from './gifs/blinker_3.gif'
import blinker_4 from './gifs/blinker_4.gif'

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
            cells: [],
            isGameRunning: false,
            generation: 0,
            grid: {
                columns: 25,
                rows: 25
            }
        }
        
        // calls the live function each second
        setInterval(() => this.life(), 500)
    }

    componentDidMount(){
        this.setState({
            cells: this.initializedCells()
        })
    }


    // initializes cells
    initializedCells() {
        // 2d boolean array
        let cells = [];

        // fills the grid
        for (let colIndex = 0; colIndex < this.state.grid.columns; colIndex++) {
            // fills column with an empty array
            cells[colIndex] = [];
            for (let rowIndex = 0; rowIndex < this.state.grid.rows; rowIndex++) {
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
        for(let colIndex = 0; colIndex < this.state.grid.columns; colIndex++){
            // fills column with an empty array
            newCells[colIndex] = [];
            for(let rowIndex = 0; rowIndex < this.state.grid.rows; rowIndex++){
                // populates new cells
                newCells[colIndex][rowIndex] = this.computeNewCellState(colIndex, rowIndex)
            }
        }

        this.setState({
            cells: newCells,
            generation: this.state.generation + 1
        })
    }

    // clears grid of all life
    clearGrid() {
        // if game is running, stop it
        if (this.state.isGameRunning){
            this.setState({isGameRunning: !this.state.isGameRunning})
        }
        
        // set the state to an empty grid, restart generation count
        this.setState({
            cells: this.initializedCells(),
            generation: 0
        })
    }

    // generates a new grid depending on user choice
    setNewGridSize(size) {
        console.log(size)
        switch (size) {
            case "1":
                this.setState({
                    grid: {
                        columns: 20,
                        rows: 10
                    }
                })
            break;
            case "2":
                this.setState({
                    grid: {
                        columns: 30,
                        rows: 40
                    }
                })
            break;
            default:
                this.setState({
                    grid: {
                        columns: 25,
                        rows: 25
                    }
                })
        }
        console.log(this.state.grid)
        this.clearGrid();
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
            if (newColOffset < 0 || newColOffset > this.state.grid.columns - 1) {
                continue;
            }
            if (newRowOffset < 0 || newRowOffset > this.state.grid.rows - 1){
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

    // renders the clear button 
    renderClearButton(){
        return (
            <button className="clear_button"
            onClick={() => this.clearGrid()}> 
            Clear
            </button>
        )
    }

    // handle event listener
    handleSelect(event) {
      this.setNewGridSize(event.target.value);
    }

    // renders grid size dropdown 
    renderGridSizeButton() {
        return (
            <select
                id = "grid-size"
                name= "size"
                onChange={this.handleSelect.bind(this)}>
                    <option value="1">20 x 10</option>
                    <option value="2">30 x 40</option>
                    <option value="3">25 x 25</option>
                </select>
        )
    }

    // renders button for user color choice
    renderCellColorPicker() {
        return(
            <select
            id= "color-choice"
            name= "grid-color"
            >
                <option value="red">red</option>
                <option value="blue"> blue</option>
                <option value="green">green</option>
            </select>
        )
    }


    // renders this component
    render() {
        return (
            <div className="container">
                <h1>Game of Life</h1>
                <div className="content">
                    <div className="GameOfLife">
                        {this.renderStartButton()}
                        {this.renderClearButton()}
                        {this.renderGridSizeButton()}
                        {this.renderCellColorPicker()}
                        {this.rendercells()}
                        <h2>Generations: {this.state.generation}</h2>
                    </div>
                    <div className="presets">
                        <h2>POPULAR PRESETS</h2>
                            <img className="blinker_1" src={blinker_2} alt="preset 2"/>
                            <h3>Preset 1</h3>
                            <img className="blinker_2" src={blinker_3} alt="preset 3"/>
                            <h3>Preset 2</h3>
                            <img className="blinker_3" src={blinker_4} alt="preset 4"/>
                            <h3>Preset 3</h3>
                    </div>
                    <div className="about">
                        <div className="rules">
                            <h2>RULES</h2>
                            <p>1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.</p>

                            <p>2. Any live cell with two or three live neighbours lives on to the next generation.</p>

                            <p>3. Any live cell with more than three live neighbours dies, as if by overpopulation.</p>

                            <p>4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</p>
                        </div>
                        <div className="creator">
                            <h2>ABOUT THE CREATOR,</h2>
                            <h2>JOHN CONWAY</h2>
                            <p>The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970.[1] It is a zero-player game, meaning that its evolution is determined by its initial state, requiring no further input. One interacts with the Game of Life by creating an initial configuration and observing how it evolves. It is Turing complete and can simulate a universal constructor or any other Turing machine.</p>
                        </div>
                        
                    </div>

                    
                </div>
            </div>
        )
    }
}

