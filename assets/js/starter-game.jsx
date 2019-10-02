import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Starter/>, root);
}

// State structure:
// {
//    0:{
//      leter:'E',      //Letter stored at tile 1
//      status:'hide',  //Status of the tile hide=>not active, active=> displayed but not yet matched, completed=>matched
//      count:0         //Number of times this tile is clicked
//     },
//    1:{},             //Tile 2
//      ...
//      ...
//      ...,
//     15:{}            //Tile 16
// }

class Starter extends React.Component {
    //Constructor method for initializing the state
    constructor(props) {
        super(props);
        //Generating tiles data and initializing tile properties
        //{0:{letter:'D',status:'hide',count:0},1:{...},....}
        let tilesGenerated = this.getInitialTiles()
        this.state = {tileData: tilesGenerated};
        // Attribution http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/notes/05-react/
        this.handleClick = this.handleClick.bind(this);
    }

    getInitialTiles() {
        //Having the letters for our game
        let letters = 'ABCDEFGHABCDEFGH'.split('')
        let gameTiles = {}
        //Temp variable for iteration purposes
        let iter = letters.length
        while (iter != 0) {
            //Referred https://flaviocopes.com/how-to-generate-random-number-between/ for random number generation
            //in a range
            let i = Math.floor(Math.random() * (iter));
            // Setting the game config
            // Display structure defined at line 9
            gameTiles[iter] = {}
            gameTiles[iter]['letter'] = letters.splice(i, 1)[0]
            gameTiles[iter]['status'] = "hide"
            gameTiles[iter]['count'] = 0
            iter--;
        }
        return gameTiles;
    }

    //This method serves the purpose of updating any tile detail i.e changing state based on given params
    //data : state object, ids : ids of tiles to be modified, status : status with which tiles should be updated
    //incrementCount : to increment or not increment count
    updateTiles(data, ids, status, incrementCount = false) {
        //Iterating through provided ids
        _.map(ids, function (id) {
            //Updating status of given ids with given state
            data[id]['status'] = status
            //For complete this is will result in additional score point to prevent it we have this condition
            if (status != 'complete' && incrementCount) {
                data[id]['count']++
            }
        })
        //Handling for complete case
        if (status == 'complete' && incrementCount) {
            data[ids[1]]['count']++
        }
        //Updating the state with updated information
        this.setState({tileData: data})
    }

    //This method is to handle the click of tiles. Based on the state of game, the new state will be generated here.
    handleClick(id) {
        //taking the state object in another variable
        let data = this.state.tileData;
        //Getting the currently active tiles
        let currentActive = _.filter(data, {'status': 'active'})
        //To prevent actions during delay
        if (currentActive.length < 2) {
            //For matched tiles nothing is to be done
            if (data[id]['status'] != 'complete') {
                //Finding the active tile index/key
                let activeKey = _.findKey(data, {'status': 'active'})
                //Clicking on currently active tile again
                if (activeKey != id) {
                    //If this is the second active tile check for next scenario i.e match or not
                    if (activeKey != undefined) {
                        //For match condition
                        if (data[activeKey]['letter'] == data[id]['letter']) {
                            this.updateTiles(data, [activeKey, id], 'complete', true)
                        } else {
                            //For not match condition
                            //First show the selected tiles as active
                            this.updateTiles(data, [id], 'active', true)
                            //Update state after the delay
                            setTimeout(() => {
                                this.updateTiles(data, [activeKey, id], 'hide')
                            }, 1000);
                        }
                    } else {
                        //For first active tile update the state with active
                        this.updateTiles(data, [id], 'active', true)
                    }
                }
            }
        }
    }

    //For resetting or restarting the game
    reset() {
        let tilesGenerated = this.getInitialTiles()
        this.setState({tileData: tilesGenerated})
    }

    //Utility to get score for the game
    getScore() {
        let score = 0;
        //loop through all the data and get total score
        _.map(this.state.tileData, function (key, value) {
            score += key['count'];
        });
        return score;
    }

    //Utility to get game status
    fetchGameStatus(STATUS) {
        //Get the number of tiles completed
        let completedTiles = _.filter(this.state.tileData, {'status': 'complete'})
        //Game 0 implies not started case
        if (this.getScore() == 0) {
            return STATUS.BEGIN;
        } else if (completedTiles.length == 16) {
            //All tiles matched case
            return STATUS.COMPLETE;
        }
        return STATUS.INPROGRESS;
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
                let classVar = this.state.tileData[id]['status'] == 'hide' ? '' : 'tile-' + this.state.tileData[id]['status']
                col_grids.push(<td key={id} id={id} className={'column column-25 tile ' + classVar}
                                   onClick={() => {
                                       this.handleClick(id)
                                   }}>{this.state.tileData[id]['status'] != 'hide'
                    ? this.state.tileData[id]['letter'] : ''}</td>)
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

    //Utility for score rendering area. Not to display before the game begin
    renderScoreArea(gameStatus, STATUS) {
        if (gameStatus != STATUS.BEGIN) {
            //When game completes
            let scoreLabel = (gameStatus == STATUS.COMPLETE) ? "Final Score" : "Score"
            let score = <span
                className="column column-100"><h1><u>{scoreLabel}</u></h1><h2>{this.getScore()}</h2></span>;
            return score
        }
        return <span></span>
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

