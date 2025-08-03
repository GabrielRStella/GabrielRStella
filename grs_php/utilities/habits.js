function date_string(date) {
    //https://stackoverflow.com/a/4929629
    var dd = String(date.getDate()).padStart(2, '0');
    // var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var mm = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][date.getMonth()];
    var yyyy = date.getFullYear();
    //
    // return dd + '/' + mm + '/' + yyyy;
    return dd + mm + yyyy;
}

function pretty_string(date) {
    //https://stackoverflow.com/a/4929629
    var dd = String(date.getDate());
    // var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var mm = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()];
    var yyyy = date.getFullYear();
    //
    return dd + ' ' + mm + ' ' + yyyy;
}

function day_before(date) {
    //https://stackoverflow.com/a/16401836
    var d = new Date(date.getTime());
    d.setDate(date.getDate() - 1);
    return d;
}

function today() {
    return new Date();
}

class HabitTracking extends React.Component {
    constructor(props) {
        super(props);
    }

    onClick(habit, number) {
        // var clicked = this.state.clicked;
        // clicked[habit] = number;
        // this.setState({clicked: clicked});
        this.props.cb(this.props.date, habit, number);
    }

    render() {

        var clicked = {};
        //https://stackoverflow.com/a/3390426
        if(typeof this.props.values !== 'undefined') {
            //https://dev.to/devtronic/javascript-map-an-array-of-objects-to-a-dictionary-3f42#comment-22poe
            //let dictionary = Object.fromEntries(data.map(x => [x.id, x.country]));
            var values = this.props.values;
            clicked = Object.fromEntries(this.props.habits.map(habit => [habit, (habit in values) ? values[habit] : -1]));
        }
        else {
            //https://dev.to/devtronic/javascript-map-an-array-of-objects-to-a-dictionary-3f42#comment-22poe
            //let dictionary = Object.fromEntries(data.map(x => [x.id, x.country]));
            clicked = Object.fromEntries(this.props.habits.map(habit => [habit, -1]));
        }

        return React.createElement('div', {},
            React.createElement('div', { className: "row" },
                React.createElement('p', { className: "flow-text center-align" },
                    this.props.msg
                ),
            ),
            React.createElement('table', {},
                //header row
                React.createElement('tr', {},
                    React.createElement("th", {}, "Habit"),
                    React.createElement("th", {}, "No"),
                    React.createElement("th", {}, "Some"),
                    React.createElement("th", {}, "Yes")
                ),
                //one row per habit
                this.props.habits.map((habit) => {
                    return React.createElement('tr', {},
                        React.createElement("td", {}, habit),
                        React.createElement("td", {}, 
                            React.createElement('label', {},
                                React.createElement("input", { name: "habit_group_" + this.props.date + "_" + habit, type: "radio", checked: (clicked[habit] == 0), id: "radio_" + this.props.date + "_" + habit + "_0", onChange: this.onClick.bind(this, habit, 0) }),
                                React.createElement('span', {},
                                    ""
                                )
                            ),
                        ),
                        React.createElement("td", {}, 
                            React.createElement('label', {},
                                React.createElement("input", { name: "habit_group_" + this.props.date + "_" + habit, type: "radio", checked: (clicked[habit] == 1), id: "radio_" + this.props.date + "_" + habit + "_1", onChange: this.onClick.bind(this, habit, 1) }),
                                React.createElement('span', {},
                                    ""
                                )
                            ),
                        ),
                        React.createElement("td", {}, 
                            React.createElement('label', {},
                                React.createElement("input", { name: "habit_group_" + this.props.date + "_" + habit, type: "radio", checked: (clicked[habit] == 2), id: "radio_" + this.props.date + "_" + habit + "_1", onChange: this.onClick.bind(this, habit, 2) }),
                                React.createElement('span', {},
                                    ""
                                )
                            ),
                        ),
                    )
                })
            )
        );

        /*
                React.createElement('form', { action: "#" },
                    React.createElement('label', {},
                        React.createElement("input", { name: "habit_group_" + this.props.date, type: "radio", checked: false }),
                        React.createElement('span', {},
                            "hi"
                        )
                    ),
                    React.createElement('label', {},
                        React.createElement("input", { name: "habit_group_" + this.props.date, type: "radio", checked: false }),
                        React.createElement('span', {},
                            "bye"
                        )
                    ),
                    React.createElement('label', {},
                        React.createElement("input", { name: "habit_group_" + this.props.date, type: "radio", checked: false }),
                        React.createElement('span', {},
                            "test"
                        )
                    ),
                )
        */
    }
}

class HabitHistory extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement('div', { className: "row" },
            React.createElement('p', { className: "flow-text center-align" },
                "text text text"
            ),
        );
    }
}

class HabitMaker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            habit_name: ""
        };
    }

    onNameChange(event) {
        this.setState({ habit_name: event.target.value });
    }

    onEnter(event) {
        this.props.cbNew(this.state.habit_name);
        this.setState({ habit_name: "" });
    }

    render() {
        //TODO: also add buttons to delete existing habits

        return React.createElement('div', { className: "row valign-wrapper" },
            React.createElement('div', { className: "input-field col l6" },
                React.createElement('input', { type: "text", id: "field_habit_name", value: this.state.habit_name, onChange: this.onNameChange.bind(this) }),
                React.createElement('label', { "for": "field_habit_name" }, "New Habit Name")
            ),
            React.createElement('div', { className: "btn col l2 s12 blue accent-4", onClick: this.onEnter.bind(this) },
                "Add"
            )
        );
    }
}

class Habits extends React.Component {

    constructor(props) {
        super(props);

        var store = window.localStorage;
        this.state = {
            //
            // habits: {
            //     "habit 1": ["no", "ok", "yes"],
            //     "habit 2": ["no", "yes"]
            // },
            habits: [],
            //additional info about each habit

            //? [UUID, number of options (for scaling), ...]

            //the user's habit history
            //a dictionary of dictionaries, from [date] -> {habit: number, habit: number, ...}
            history: {},
            //the last date that is missing data
            last_date: null
        };

        //load data
        var habit_data = window.localStorage.getItem("habits");
        if (habit_data != null) {
            this.state["habits"] = JSON.parse(habit_data);
            //load data
            var history_data = window.localStorage.getItem("habit_history");
            if (history_data != null) {
                this.state["history"] = JSON.parse(history_data);
            }
        } else {
            this.state["habits"] = ["example 1", "example 2"]
            //also fill in example data
            this.state["history"] = {
                "03aug2025": { "example 1": 1, "example 2": 0 },
                "02aug2025": { "example 1": 2, "example 2": 1 },
                "01aug2025": { "example 1": 2, "example 2": 0 },
                "31jul2025": { "example 1": 1, "example 2": 2 },
                "29jul2025": { "example 1": 0, "example 2": 1 }
            };
        }

        //find the last_date missing data, starting from yesterday
        this.state["last_date"] = this.findLastDate(day_before(today()), this.state.habits, this.state.history);
    }

    findLastDate(d, habits, history) {
        while (true) {
            var s = date_string(d);
            if (s in history) {
                var data = history[s];
                var missing_key = false;
                for (var key in habits) {
                    if (!(habits[key] in data)) {
                        missing_key = true;
                        break;
                    }
                }
                //
                if (missing_key) {
                    break;
                }
            } else {
                break;
            }
            d = day_before(d);
        }
        return d;
    }

    onTrack(day, habit, number) {
        /*
        day: id (string) of day that is being tracked
        habit: name of habit that is being updated
        number: the index of the button clicked by the user
        */

        var history = this.state.history; //TODO: maybe i should make a copy... *shrug*
        if (day in history) {
            //already exists, just update
            history[day][habit] = number;
        } else {
            var d = {};
            d[habit] = number;
            history[day] = d;
        }
        //save and update
        window.localStorage.setItem("habit_history", JSON.stringify(history));
        //
        var new_last_date = this.findLastDate(day_before(today()), this.state.habits, history);
        this.setState({ history: history, last_date: new_last_date })

    }

    onNewHabit(name) {
        var habits = this.state.habits.slice();
        habits.push(name);
        this.setState({ habits: habits, last_date: this.findLastDate(day_before(today()), habits, this.state.history) });

        //
        window.localStorage.setItem("habits", JSON.stringify(this.state.habits));
    }

    onDelHabit(name) {
        //TODO
    }

    render() {
        console.log(this.state.habits);

        var store = window.localStorage;
        // store.setItem("dice_info", JSON.stringify(this.state.dice));
        var last_date = this.state.last_date;
        //
        return React.createElement('div', { className: "container" },
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "Tracking"
                    ),
                ),
                React.createElement(HabitTracking, { habits: this.state.habits, values: this.state.history[date_string(today())], cb: this.onTrack.bind(this), date: date_string(today()), msg: "For: today, " + pretty_string(today()) })
            ),
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "Back-Tracking"
                    ),
                ),
                (last_date == null) ?
                    React.createElement('p', { className: "flow-text center-align" }, "Loading...") :
                    React.createElement(HabitTracking, { habits: this.state.habits, values: this.state.history[date_string(last_date)], cb: this.onTrack.bind(this), date: date_string(last_date), msg: "For: " + pretty_string(last_date) })
            ),
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "History"
                    ),
                ),
                React.createElement(HabitHistory, { habits: this.state.habits, history: this.history })
            ),
            React.createElement('div', { className: "divider" }),
            React.createElement('div', { className: "section" },
                React.createElement('div', { className: "center-align" },
                    React.createElement('h2', {},
                        "Manage Habits"
                    ),
                ),
                React.createElement(HabitMaker, { habits: this.state.habits, cbNew: this.onNewHabit.bind(this), cbDel: this.onDelHabit.bind(this) })
            )
        );
    }

    componentDidUpdate() {
        M.AutoInit();
    }
}

ReactDOM.render(React.createElement(Habits), document.getElementById('react-app'))