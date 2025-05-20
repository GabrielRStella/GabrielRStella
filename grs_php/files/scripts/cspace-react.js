// <div class="row">
// <div class="col s12 m6">
//     <canvas id="bucket-canvas" style="width: 100%; aspect-ratio: 1;"></canvas>
// </div>
// <div class="col s12 m6">
//     2
// </div>
// <div class="col s12 m6">
//     3
// </div>
// <div class="col s12 m6">
//     4
// </div>
// </div>

//one robot + its cspace
class VizRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        //medium or large
        //     <div class="">
        //     
        // </div>
        // <div class="col s12 m6">
        //     2
        // </div>
        return React.createElement('div', { className: "row" },
            React.createElement('div', {className: "col s12 m6"},
                //<canvas id="bucket-canvas" style="width: 100%; aspect-ratio: 1;"></canvas>
                React.createElement('canvas', {id: "canvas-robot-" + this.props.id, style: {width: "100%", aspectRatio: "1"}})
            ),
            React.createElement('div', {className: "col s12 m6"},
                React.createElement('canvas', {id: "canvas-cspace-" + this.props.id, style: {width: "100%", aspectRatio: "1"}})
            ),
        );
    }
}

//a bunch of robots and their cspace visualizations
class VizList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    render() {
        return React.createElement('div', {},
            this.props.robots.map((robot_id, idx) => {return [
                React.createElement('div', {className: "divider"}),
                React.createElement('p', {className: "flow-text center"}, this.props.titles[idx]),
                // this.props.titles[idx],
                React.createElement(VizRow, {id: robot_id}),
            ]})
        );
    }
}

//TODO: set up the various robots in another script
//translating point robot, translating circle robot, 2-dof arm with fixed base, arm that rotates on a prismatic joint
//tpoint, tcircle, arm, slider
root_props = {
    robots: ["tpoint", "tcircle", "arm", "slider"],
    titles: [
        "A point robot translating in the plane",
        "A circular robot (no orientation) translating in the plane",
        "A robot arm with two revolute joints",
        "A rotating arm on a prismatic (sliding) joint"
    ]
};
ReactDOM.render(React.createElement(VizList, root_props), document.getElementById('react-root'))