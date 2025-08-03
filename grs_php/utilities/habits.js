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
        if (typeof this.props.values !== 'undefined') {
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
    }
}

function get_color(val) {
    if(val < 0) {
        return "#b0b0b0"; //data missing
    }
    var r = Math.sqrt(Math.cos(val * Math.PI / 2));
    var g = Math.sqrt(Math.sin(val * Math.PI / 2));
    return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + ",0)";
}

class HabitHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: {}
        };

        for (var idx in this.props.habits) {
            this.state.clicked[this.props.habits[idx]] = true;
        }
    }

    onSelect(habit) {
        var clicked = this.state.clicked;
        clicked[habit] = !clicked[habit];
        this.setState({ clicked: clicked });
    }

    render() {
        //the habits that we are visualizing (just average all of them together)
        // var habits = [];
        // for (var habit in this.state.clicked) {
        //     if (this.state.clicked[habit]) habits.push(habit);
        // }
        // console.log(habits);

        //average the data together to get just one value for each day, in [0, 1]
        var data = {};
        var n = 0;
        for (var day in this.props.history) {
            var vals = this.props.history[day];
            var total = 0;
            var denom = 0;
            for (var key in vals) {
                if(!this.state.clicked[key]) continue;
                total += vals[key];
                denom += 2;
            }
            if(denom == 0) data[day] = null;
            else data[day] = total / denom;
            n++;
        }

        //convert that to a list, indexed by "number of days ago"
        //with value=null if there is no data for a given day
        var days = [];
        //
        var d = today();
        while (n > 0) {
            var s = date_string(d);
            if (s in data) {
                days.push(data[s]);
                n--;
            } else {
                days.push(null);
            }
            d = day_before(d);
        }
        //
        // var sz = (100 / days.length) + "%";
        // var bg = days.map((val) => get_color(val));
        // days = days.reverse();

        //the time-spans to visualize, plus the number of datapoints that gets averaged for each
        //each is only displayed if there is enough data to make more than one span (e.g., 8 items necessary to display weeks)
        var spans = {
            "Days": 1,
            "Weeks": 7,
            "Months": 30,
            "Years": 365
        };

        // construct the data series
        var series = [];
        for (var span in spans) {
            var n_items = spans[span];
            //
            var row = [];
            // for (var i = 0; i < days.length - n_items + 1; i++) {
            //     var total = 0;
            //     for (var j = 0; j < n_items; j++) {
            //         total += days[i + j];
            //     }
            //     row.push(total / n_items);
            // }
            var i = 0;
            while(i < days.length) {
                var total = 0;
                var n = 0;
                for (var j = 0; j < n_items && i < days.length; j++) {
                    if(days[i] != null) {
                        total += days[i];
                        n++;
                    }
                    i++;
                }
                if(n > 0) 
                    row.push(total / n);
                else
                    row.push(-1);
            }
            //
            if (row.length > 1) {
                row = row.reverse();
                if(row.length > 100) {
                    row = row.slice(0, 100);
                }
                series.push([span, row]);
                //TODO: cut off at 100 elements (but also, that'll require changing how the longer ones like weekd and months work, since right now they display an average for each day)
            }
        }

        return React.createElement('div', {},
            React.createElement('div', { className: "row center" },
                this.props.habits.map(
                    // (habit) => React.createElement('label', { className: "col s6 l4"},
                    //     React.createElement("input", { type: "checkbox", className: "filled-in", checked: this.state.clicked[habit], onChange: this.onSelect.bind(this, habit) }),
                    //     React.createElement('span', {},
                    //         habit
                    //     )
                    // )
                    (habit) => React.createElement("div", {className: "col l2 s6 center"},
                        React.createElement('div', { className: "btn " + (this.state.clicked[habit] ? "blue accent-4" : "grey"), onClick: this.onSelect.bind(this, habit) },
                            habit
                        )
                    )
                )
            ),
            (series.length == 0) ?
                React.createElement('div', { className: "row" },
                    React.createElement('p', { className: "flow-text center-align" },
                        "Not enough data"
                    ),
                ) :
                React.createElement('div', { className: "row" },
                    series.map(
                        (pair) => React.createElement('div', { className: "row valign-wrapper" },
                            React.createElement('p', { className: "col  s2" },
                                pair[0]
                            ),
                            React.createElement('div', { className: "col s10" },
                                // "\u00A0",
                                pair[1].map((val, idx) => React.createElement('span', { style: { width: (100 / pair[1].length) + "%", background: get_color(val), display: "inline-block" } }, "\u00A0"))
                            )
                        ),
                    )
                )
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

    onKey(event) {
        //https://stackoverflow.com/a/20998671
        if (event.key === 'Enter') {
            this.onEnter();
        }
    }

    onEnter(event) {
        if (this.state.habit_name != "")
            this.props.cbNew(this.state.habit_name);
        this.setState({ habit_name: "" });
    }

    onDel(habit) {
        this.props.cbDel(habit);
    }

    render() {
        return React.createElement("div", {},
            React.createElement('div', { className: "row valign-wrapper" },
                React.createElement('div', { className: "input-field col l10 s6" },
                    React.createElement('input', { type: "text", id: "field_habit_name", value: this.state.habit_name, onChange: this.onNameChange.bind(this), onKeyDown: this.onKey.bind(this) }),
                    React.createElement('label', { "for": "field_habit_name" }, "New Habit Name")
                ),
                React.createElement('div', { className: "btn col l2 s6 blue accent-4", onClick: this.onEnter.bind(this) },
                    "Add"
                )
            ),
            this.props.habits.map(
                (habit) => React.createElement('div', { className: "row valign-wrapper" },
                    React.createElement('p', { className: "col  s6 l10" },
                        habit
                    ),
                    React.createElement('div', { className: "btn col s6 l2 red", onClick: this.onDel.bind(this, habit) },
                        "Delete"
                    )
                ),
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
            this.state["habits"] = ["eating", "sleeping"]
            //also fill in example data
            // this.state["history"] = {
            //     "03aug2025": { "eating": 1, "sleeping": 0 },
            //     "02aug2025": { "eating": 2, "sleeping": 1 },
            //     "01aug2025": { "eating": 2, "sleeping": 0 },
            //     "31jul2025": { "eating": 1, "sleeping": 2 },
            //     "29jul2025": { "eating": 0, "sleeping": 1 }
            // };
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
        window.localStorage.setItem("habits", JSON.stringify(habits));
    }

    onDelHabit(name) {
        var idx = this.state.habits.indexOf(name);
        if (idx >= 0) {
            var habits = this.state.habits.toSpliced(idx, 1);
            this.setState({ habits: habits, last_date: this.findLastDate(day_before(today()), habits, this.state.history) });
            window.localStorage.setItem("habits", JSON.stringify(habits));
        }
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
                React.createElement(HabitHistory, { habits: this.state.habits, history: this.state.history })
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