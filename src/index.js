import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

const getWorkouts = () => {
  const urlFragment0 = 'https://app.wodify.com/API/WODs_v1.aspx?apiKey=274jjw066romuea8bxp0a0rew&date=';
  const urlFragment1 = '&type=json&location=Flagship+Upper+Market&program=F+%7C+';

  const prog = {
    cond: 'Conditioning',
    perf: 'Performance',
    stre: 'Strength+Development',
  }
  const classDays = [
    [ prog.cond, prog.perf ],
    [ prog.cond, prog.perf, prog.stre ],
    [ prog.cond, prog.perf, prog.stre ],
    [ prog.cond, prog.perf, prog.stre ],
    [ prog.cond, prog.perf, prog.stre ],
    [ prog.perf ],
    [ prog.cond, prog.perf ]
  ];

  const today = new Date();
  const week = [];

  for (let i = 0; i < 8; i++) {
    const day = new Date();
    day.setDate(today.getDate() + i)
    week.push(day);
  }

  console.log(typeof week[0]);

  const promises = [];

  const workoutsForDay = (day) => {
    const classList = classDays[day.getDay()];
    classList.forEach((classString) => {
      const fetchClass = fetch(`${urlFragment0}${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}${urlFragment1}${classString}`).then(res => res.json());
      promises.push(fetchClass);
    });
  };

  week.forEach((day) => {
    workoutsForDay(day);
  });

  return Promise.all(promises);
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    getWorkouts().then(data => this.setState({ data }));
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
      {this.state.data.map((workoutData, i) => {
        let workoutEl;
        console.log(workoutData);
        if (workoutData.RecordList) {
          workoutEl =
            <div className="workoutEntry" key={i}>
              <h2>{workoutData.RecordList.APIWod.WodHeader.Name}</h2>
              {workoutData.RecordList.APIWod.Components.Component.map((comp, j) => {
                return <span key={j}>
                  <h3>{comp.Name}</h3>
                  <p>{comp.Description}</p>
                  <p>{comp.Comments}</p>
                </span>;
              })}
              <hr/>
            </div>;
        }

        return workoutEl;
      })}
        <header className="App-header">
          <a
            className="App-link"
            href="https://app.wodify.com/Schedule/CalendarListViewEntry.aspx"
            target="_blank"
            rel="noopener noreferrer"
          >
            wodify calendar
          </a>
        </header>
      </div>
    );
  }
}

ReactDOM.render(
	<App/>,
	document.getElementById('app')
);

module.hot.accept();