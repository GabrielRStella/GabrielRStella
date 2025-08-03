class Habits extends React.Component {

    constructor(props) {
        super(props);

        var store = window.localStorage;
        this.state = {
        };
    }

    render() {
        var store = window.localStorage;
        // store.setItem("dice_info", JSON.stringify(this.state.dice));
        //
        return React.createElement('div', { className: "container" },
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "Tracking"
                    ),
                ),
                React.createElement('div', { className: "row" },
                    React.createElement('p', { className: "flow-text" },
                        "text text text"
                    ),
                )
            ),
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "Back-Tracking"
                    ),
                ),
                React.createElement('div', { className: "row" },
                    React.createElement('p', { className: "flow-text" },
                        "text text text"
                    ),
                )
            ),
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "History"
                    ),
                ),
                React.createElement('div', { className: "row" },
                    React.createElement('p', { className: "flow-text" },
                        "text text text"
                    ),
                )
            ),
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "New Habits"
                    ),
                ),
                React.createElement('div', { className: "row" },
                    React.createElement('p', { className: "flow-text" },
                        "text text text"
                    ),
                )
            )
        );
    }
}

ReactDOM.render(React.createElement(Habits), document.getElementById('react-app'))