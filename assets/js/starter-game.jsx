import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Starter/>, root);
}

class Starter extends React.Component {
    constructor(props) {
        super(props);
        let tilesGenerated = this.getInitialTiles()
        this.state = {tileData: tilesGenerated};
        this.handleClick = this.handleClick.bind(this);
    }

    getInitialTiles() {
        let letters = 'ABCDEFGHABCDEFGH'.split('')
        let gameTiles = {}
        let iter = letters.length
        while (iter != 0) {
            //Referred https://flaviocopes.com/how-to-generate-random-number-between/ for random number generation
            //in a range
            let i = Math.floor(Math.random() * (iter));
            gameTiles[iter] = {}
            gameTiles[iter]['letter'] = letters.splice(i, 1)[0]
            gameTiles[iter]['status'] = "hide"
            gameTiles[iter]['count'] = 0
            iter--;
        }
        return gameTiles;
    }

    updateTiles(data, ids, status, incrementCount = false) {
        _.map(ids, function (id) {
            data[id]['status'] = status
            if (status != 'complete' && incrementCount) {
                data[id]['count']++
            }
        })
        if (status == 'complete' && incrementCount) {
            data[ids[1]]['count']++
        }
        this.setState({tileData: data})
    }

    handleClick(id) {
        let data = this.state.tileData;
        let currentActive = _.filter(data, {'status': 'active'})
        if (currentActive.length < 2) {
            if (data[id]['status'] != 'complete') {
                let activeKey = _.findKey(data, {'status': 'active'})
                if (activeKey != id) {
                    if (activeKey != undefined) {
                        if (data[activeKey]['letter'] == data[id]['letter']) {
                            this.updateTiles(data, [activeKey, id], 'complete', true)
                        } else {
                            this.updateTiles(data, [id], 'active', true)
                            setTimeout(() => {
                                this.updateTiles(data, [activeKey, id], 'hide')
                            }, 1000);
                        }
                    } else {
                        this.updateTiles(data, [id], 'active', true)
                    }
                }
            }
        }
    }

    reset() {
        let tilesGenerated = this.getInitialTiles()
        this.setState({tileData: tilesGenerated})
    }

    getScore() {
        let score = 0;
        _.map(this.state.tileData, function (key, value) {
            score += key['count'];
        });
        return score;
    }

    fetchGameStatus(STATUS) {
        let completedTiles = _.filter(this.state.tileData, {'status': 'complete'})
        if (this.getScore() == 0) {
            return STATUS.BEGIN;
        } else if (completedTiles.length == 16) {
            return STATUS.COMPLETE;
        }
        return STATUS.INPROGRESS;
    }

    generateGridRows() {
        let grid_rows = []
        let grid_ind = 1
        for (let row = 1; row <= 4; row++) {
            let col_grids = []
            for (let col = 1; col <= 4; col++) {
                // Referred to reactjs documentation for handle click
                let id = grid_ind++
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

    renderInstructionSection(gameStatus, STATUS) {
        if (gameStatus == STATUS.BEGIN) {
            return <span className="game-instruction">Click on any tile to begin the game</span>
        } else {
            let buttonLabel = (gameStatus == STATUS.COMPLETE) ? " Restart Game " : "  Reset  Game  "
            let button = <button className="gameplay-btn" onClick={this.reset.bind(this)}>{buttonLabel}</button>
            return button
        }
    }

    renderScoreArea(gameStatus, STATUS) {
        if (gameStatus != STATUS.BEGIN) {
            let scoreLabel = (gameStatus == STATUS.COMPLETE) ? "Final Score" : "Score"
            let score = <span
                className="column column-100"><h1><u>{scoreLabel}</u></h1><h2>{this.getScore()}</h2></span>;
            return score
        }
        return <span></span>
    }

    renderGameInfo() {
        const STATUS = {
            BEGIN: "Yet to Start..",
            INPROGRESS: "In Progress...",
            COMPLETE: "YOU WIN!!!!"
        }
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

