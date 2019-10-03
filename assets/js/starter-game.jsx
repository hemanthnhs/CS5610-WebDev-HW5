import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Starter channel={channel}/>, root);
}

class Starter extends React.Component {
    //Constructor method for initializing the state
    constructor(props) {
        super(props);
        this.channel = props.channel;
        //Generating tiles data and initializing tile properties
        //{0:{letter:'D',status:'hide',count:0},1:{...},....}
        this.state = {tiles: [], active_tiles: [], completed_tiles: [], clicks: 0, gameStatus: 0};
        // Attribution http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/notes/05-react/
        this.handleClick = this.handleClick.bind(this);

        this.channel
            .join()
            .receive("ok", this.got_view.bind(this))
            .receive("error", resp => {
                console.log("Unable to join", resp);
            });
    }

    got_view(view) {
        console.log("new view", view);
        this.setState(view.tile);
    }

    //This method is to handle the click of tiles. Based on the state of game, the new state will be generated here.
    handleClick(id) {
        this.channel.push("select", {tile_id: id})
            .receive("ok", this.got_view.bind(this));
    }

    //For resetting or restarting the game
    reset() {
        let tilesGenerated = this.getInitialTiles()
        this.setState({tileData: tilesGenerated})
    }

    //Utility to get game status
    fetchGameStatus(STATUS) {
        //Game 0 implies not started case
        if (this.state.gameStatus == 0) {
            return STATUS.BEGIN;
        } else if (this.state.gameStatus == 2) {
            //All tiles matched case
            return STATUS.COMPLETE;
        }
        return STATUS.INPROGRESS;
    }

    //Utility for score rendering area. Not to display before the game begin
    renderScoreArea(gameStatus, STATUS) {
        if (gameStatus != STATUS.BEGIN) {
            //When game completes
            let scoreLabel = (gameStatus == STATUS.COMPLETE) ? "Final Score" : "Score"
            let score = <span
                className="column column-100"><h1><u>{scoreLabel}</u></h1><h2>{this.state.clicks}</h2></span>;
            return score
        }
        return <span></span>
    }

    // Render utility to generate tiles
    generateGridRows() {
        // Object to store the tiles
        let grid_rows = []
        let grid_ind = 1
        // For each row
        for (let row = 1; row <= 4; row++) {
            let col_grids = []
            //For each column
            for (let col = 1; col <= 4; col++) {
                // Referred to reactjs documentation for handle click
                let id = grid_ind++
                // To assign class based on state
                // Useful for styling
                let classVar = "hide"
                if (this.state.active_tiles.includes(id)) {
                    classVar = "tile-active"
                } else if (this.state.completed_tiles.includes(id)) {
                    classVar = "tile-complete"
                }
                col_grids.push(<td key={id} id={id} className={'column column-25 tile ' + classVar}
                                   onClick={() => {
                                       this.handleClick(id)
                                   }}>{(this.state.active_tiles.includes(id) || this.state.completed_tiles.includes(id))
                    ? this.state.tiles[id - 1] : ''}</td>)
            }
            grid_rows.push(<tr key={row} className="row">{col_grids}</tr>)
        }
        return grid_rows
    }

    //Utility to get the game instruction/reset/restart button based on game status
    renderInstructionSection(gameStatus, STATUS) {
        if (gameStatus == STATUS.BEGIN) {
            return <span className="game-instruction">Click on any tile to begin the game</span>
        } else {
            let buttonLabel = (gameStatus == STATUS.COMPLETE) ? " Restart Game " : "  Reset  Game  "
            let button = <button className="gameplay-btn" onClick={this.reset.bind(this)}>{buttonLabel}</button>
            return button
        }
    }

    renderGameInfo() {
        //enum variable for game status
        const STATUS = {
            BEGIN: "Yet to Start..",
            INPROGRESS: "In Progress...",
            COMPLETE: "YOU WIN!!!!"
        }
        //Get game status
        let gameStatus = this.fetchGameStatus(STATUS);
        let status = <span
            className="column column-100"><h1><u>Game Status</u></h1><h2>{gameStatus}</h2></span>;
        let score = this.renderScoreArea(gameStatus, STATUS)
        let button = this.renderInstructionSection(gameStatus, STATUS);

        let instructions = <span className="column column-100"
                                 id="instructions-section">{button}</span>
        let gameInfo = <span className="column column-50 column-offset-10">
                            {status}{score}{instructions}
                        </span>
        return gameInfo
    }

    //Render
    render() {
        let grid_rows = this.generateGridRows()
        let tiles = <span className="column column-80 column-offset-20">
            <table>
                <tbody>{grid_rows}</tbody>
            </table>
        </span>;
        let header = <div id="game-heard" className="column column=100">Memory Game</div>
        let gameInfoDisplay = this.renderGameInfo()
        return <div>
            <div className="row">
                {header}
            </div>
            <div className="row">
                <span className="column column-50">
                    {tiles}
                </span>
                {gameInfoDisplay}
            </div>
        </div>;
    }
}

