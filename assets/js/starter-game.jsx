import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
    ReactDOM.render(<Starter channel={channel}/>, root);
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
        this.channel = props.channel;
        //Generating tiles data and initializing tile properties
        //{0:{letter:'D',status:'hide',count:0},1:{...},....}
        // this.state = {ss: tilesGenerated, active_tiles: [], completed_tiles: [], clicks: 0};
        this.state = {tiles: [], active_tiles: [], completed_tiles: [], clicks: 0};
        // Attribution http://ccs.neu.edu/home/ntuck/courses/2019/09/cs5610/notes/05-react/
        this.handleClick = this.handleClick.bind(this);

        this.channel
            .join()
            .receive("ok", this.got_view.bind(this))
            .receive("error", resp => { console.log("Unable to join", resp); });
    }

    got_view(view) {
        console.log("new view", view);
        this.setState(view.tile);
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
                col_grids.push(<td key={id} id={id} className={'column column-25 tile hide'}
                                   onClick={() => {
                                       this.handleClick(id)
                                   }}>{id in this.state.active_tiles
                    ? this.state.active_tiles[id] : ''}</td>)
            }
            grid_rows.push(<tr key={row} className="row">{col_grids}</tr>)
        }
        return grid_rows
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
        return <div>
            <div className="row">
                {header}
            </div>
            <div className="row">
                <span className="column column-50">
                    {tiles}
                </span>
            </div>
        </div>;
    }
}

