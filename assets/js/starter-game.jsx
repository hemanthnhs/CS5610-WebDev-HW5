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

    // componentDidMount() {
    //     let tileData = this.getInitialTiles()
    //     this.setState({tileData: tileData});
    // }

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
            gameTiles[iter]['display'] = false
            iter--;
        }
        return gameTiles;
    }

    handleClick(event) {
        let data = this.state.tileData;
        data[event.target.id]['display'] = true
        this.setState({tileData: data})
    }

    reset(_ev) {
        // TODO
        alert("TODO Game Reset");
    }

    render() {
        let button = <span><button onClick={this.reset.bind(this)}>Reset Game</button></span>
        let grid_rows = []
        let grid_ind = 1
        for (let row = 1; row <= 4; row++) {
            let col_grids = []
            for (let col = 1; col <= 4; col++) {
                // Referred to reactjs documentation for handle click
                let id = grid_ind++
                col_grids.push(<td key={id} id={id} className="column column-10 tile"
                                   onClick={this.handleClick}>{this.state.tileData[id]['display']
                    ? this.state.tileData[id]['letter'] : ''}</td>)
            }
            grid_rows.push(<tr key={row} className="row">{col_grids}</tr>)
        }
        let tiles = <div>
            <table className="container">
                <tbody>{grid_rows}</tbody>
            </table>
        </div>;

        return <div>
            {tiles}
            {button}
        </div>;
    }
}

