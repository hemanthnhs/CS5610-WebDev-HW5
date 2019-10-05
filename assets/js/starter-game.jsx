import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Starter channel={channel}/>, root);
}

//Attribution : Nats Notes - CS5610
/*
* State structure
* state = {
*   tiles = [], // tile data
*   active_tiles: [], // indexes of active tiles
*   completed_tiles: [], // indexes of completed tiles
*   clicks: 0, //clicks to complete the game
*   gameStatus: 0 //game status as in yet to start (or) in progress (or) completed
* }
* */
class Starter extends React.Component {
    //Constructor method for initializing the state
    constructor(props) {
        super(props);
        this.channel = props.channel;
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
        this.setState(view.tile);
        if (view.tile.active_tiles.length == 2) {
            //Update state after the delay
            //Having this delay in client side as we didnt have GenServer setup yet to avoid/ignore calls during delay.
            setTimeout(() => {
                this.channel.push("clear_active", {})
                    .receive("ok", this.got_view.bind(this));
            }, 1000);
        }
    }

    //This method is to handle the click of tiles. Based on the state of game, the new state will be generated here.
    handleClick(data, id) {
        //Having this check in client side as we didnt have GenServer setup yet to avoid/ignore calls during delay.
        if (data.active_tiles.length != 2) {
            this.channel.push("select", {tile_id: id})
                .receive("ok", this.got_view.bind(this));
        }
    }

    //For resetting or restarting the game
    reset() {
        this.channel.push("reset", {})
            .receive("ok", this.got_view.bind(this));
    }

    // The code below is purely UI and display purpose and doesn't effect the state of game.

    //Utility to have game status text
    fetchGameStatus(data, STATUS) {
        if (data.gameStatus == 0) {
            return STATUS.BEGIN;
        } else if (data.gameStatus == 2) {
            //All tiles matched case
            return STATUS.COMPLETE;
        }
        return STATUS.INPROGRESS;
    }

    //Utility for score rendering area. Not to display before the game begin
    renderScoreArea(score_val, gameStatus, STATUS) {
        console.log(score_val)
        if (gameStatus != STATUS.BEGIN) {
            //When game completes
            let scoreLabel = (gameStatus == STATUS.COMPLETE) ? "Final Score" : "Score"
            let score = <span
                className="column column-100"><h1><u>{scoreLabel}</u></h1><h2>{score_val}</h2></span>;
            return score
        }
        return <span></span>
    }

    // Render utility to generate tiles
    generateGridRows(data) {
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
                if (data.active_tiles.includes(id)) {
                    classVar = "tile-active"
                } else if (data.completed_tiles.includes(id)) {
                    classVar = "tile-complete"
                }
                col_grids.push(<td key={id} id={id} className={'column column-25 tile ' + classVar}
                                   onClick={() => {
                                       this.handleClick(data, id)
                                   }}>{(data.active_tiles.includes(id) || data.completed_tiles.includes(id))
                    ? data.tiles[id - 1] : ''}</td>)
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

    renderGameInfo(data) {
        //enum variable for game status
        const STATUS = {
            BEGIN: "Yet to Start..",
            INPROGRESS: "In Progress...",
            COMPLETE: "YOU WIN!!!!"
        }
        //Get game status
        let gameStatus = this.fetchGameStatus(data, STATUS);
        let status = <span
            className="column column-100"><h1><u>Game Status</u></h1><h2>{gameStatus}</h2></span>;
        let score = this.renderScoreArea(data.clicks, gameStatus, STATUS)
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
        let data = _.cloneDeep(this.state);
        let grid_rows = this.generateGridRows(data)
        let tiles = <span className="column column-80 column-offset-20">
            <table>
                <tbody>{grid_rows}</tbody>
            </table>
        </span>;
        let header = <div id="game-heard" className="column column=100">Memory Game</div>
        let gameInfoDisplay = this.renderGameInfo(data)
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

