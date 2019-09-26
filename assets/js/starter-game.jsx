import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
    ReactDOM.render(<Starter/>, root);
}

class Starter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {left: false};
    }

    reset(_ev) {
        // TODO
        alert("TODO Game Reset");
    }

    render() {
        let button = <span><button onClick={this.reset.bind(this)}>Reset Game</button></span>
        const grid_rows = []
        for (let row = 1; row <= 4; row++) {
            let col_grids = []
            for (let col = 1; col <= 4; col++) {
                col_grids.push(<td key={row * col} className="column column-10 tile"></td>)
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

